const Appointment = require('../models/Appointment');


exports.createappointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      timeslot, // CORRECT spelling
      isFirstTimeVisit, // CORRECT name
      notes,
      meetingLink,
      reasonForVisit,
      paymentStatus,
      durationMinutes,
      followUpRequired
    } = req.body;

    // Validate required fields
    if (
      !patientId ||
      !doctorId ||
      !date ||
      !timeslot ||
      isFirstTimeVisit === undefined
    ) {
      return res.status(400).json({ message: "Required Fields missing" });
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      timeslot,
      isFirstTimeVisit,
      notes,
      meetingLink,
      reasonForVisit,
      paymentStatus,
      durationMinutes,
      followUpRequired
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterAppointment = async (req,res) => {
    try{
        const filters = {};
        if(req.query.doctorId) filters.doctorId = req.query.doctorId;
        if(req.query.patientId) filters.patientId = req.query.patientId;
        if(req.query.status) filters.status = req.query.status;
        if (req.query.startDate || req.query.endDate) {
            filters.date = {};
            if (req.query.startDate) {
                filters.date.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filters.date.$lte = new Date(req.query.endDate);
            }
        }
        const Appointments = await Appointment.find(filters);
        res.json(Appointments);
    } catch (err){
        res.status(500).json({error: err.message});
    }
};

exports.getAllAppointment = async (req, res) => {
  try {
    // Read query parameters
    let { page, limit } = req.query;

    // Convert to numbers and set default values if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const totalAppointments = await Appointment.countDocuments();

    // Query users with skip and limit
    const appointments = await Appointment.find()
      .skip(skip)
      .limit(limit); // Example of excluding sensitive fields

    res.status(200).json({
      totalAppointments,
      totalPages: Math.ceil(totalAppointments / limit),
      currentPage: page,
      pageSize: limit,
      appointments,
      message: "appointment service is working!"
    }
  );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
};


exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    let allowedUpdates = [];

    if (req.user.role === "user") {
      allowedUpdates = [
        "date",
        "timeslot",
        "notes",
        "status",
        "cancellationReason"
      ];
    } else if (req.user.role === "doctor") {
      allowedUpdates = [
        "date",
        "timeslot",
        "durationMinutes",
        "meetingLink",
        "status",
        "followUpRequired",
        "notes"
      ];
    } else if (req.user.role === "admin") {
      // Admin can update everything
      allowedUpdates = Object.keys(req.body);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // Build update object safely
    const updates = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteAppointment = async(req,res) =>{
  try{

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Authorization check
    if ( req.user.role !== "admin" && appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: Not allowed to delete this appointment" });
    }

    await appointment.deleteOne();

    res.status(200).json({ message: "Appointment deleted successfully" });
  }catch (err){
    res.status(500).json({ error: err.message });
  }

}

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;

    if (!["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const update = { status };
    if (status === "cancelled" && cancellationReason) {
      update.cancellationReason = cancellationReason;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, timeSlot, reason } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({ message: "date and timeSlot are required" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Add to reschedule history
    appointment.rescheduleHistory.push({
      date,
      timeSlot,
      reason
    });

    // Also update the current date/timeSlot of the appointment
    appointment.date = date;
    appointment.timeslot = timeSlot;

    await appointment.save();

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
