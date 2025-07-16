const Appointment = require('../models/Appointment');
const axios = require('axios');


exports.createappointment = async (req, res) => {
  try {
    const {
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

    // Validate patient and doctor exist
    const serviceAuthHeader = { Authorization: `Bearer ${process.env.SERVICE_API_KEY}` };

    console.log("Fetching user data with:", {
        patientURL: `http://user:5002/api/users/${patientId}`,
        doctorURL: `http://user:5002/api/users/${doctorId}`,
        headers: serviceAuthHeader
    });

    const patientRes = await axios.get(`http://user:5002/api/users/${patientId}`, {
      headers: serviceAuthHeader
    });

    const doctorRes = await axios.get(`http://user:5002/api/users/${doctorId}`, {
      headers: serviceAuthHeader
    });

    if (!patientRes.data || !doctorRes.data) {
      return res.status(400).json({ message: "Invalid patient or doctor ID." });
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
    await DoctorAvailability.findOneAndUpdate(
      {
        doctorId,
        date: new Date(date),
        "timeSlots.start": timeslot.split("-")[0],
        "timeSlots.end": timeslot.split("-")[1]
      },
      {
        $set: { "timeSlots.$.isBooked": true }
      }
    );
    const dateStr = new Date(newAppointment.date).toISOString().split("T")[0];
    // After saving the appointment
    await axios.post(
      
      "http://notification:5004/api/notification",
      {
        userId: patientId,
        type: "appointment",
        message: `Your appointment on ${dateStr} at ${timeslot} is confirmed.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_API_KEY}`
        }
      }
    );


    res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const serviceAuthHeader = {
      Authorization: `Bearer ${process.env.SERVICE_API_KEY}`
    };

    const [patientRes, doctorRes] = await Promise.all([
      axios.get(`http://user:5002/api/users/${appointment.patientId}`, { headers: serviceAuthHeader }),
      axios.get(`http://user:5002/api/users/${appointment.doctorId}`, { headers: serviceAuthHeader })
    ]);

    res.json({
      appointment,
      patient: patientRes.data,
      doctor: doctorRes.data
    });
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

exports.getAppointmentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({
      $or: [{ patientId: userId }, { doctorId: userId }]
    });

    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllAppointment = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const totalAppointments = await Appointment.countDocuments();

    const appointments = await Appointment.find()
      .skip(skip)
      .limit(limit);

    const enrichedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const patientRes = await axios.get(
          `http://user:5002/api/users/${appt.patientId}`,
          {
            headers: { Authorization: `Bearer ${process.env.SERVICE_API_KEY}` }
          }
        );

        const doctorRes = await axios.get(
          `http://user:5002/api/users/${appt.doctorId}`,
          {
            headers: { Authorization: `Bearer ${process.env.SERVICE_API_KEY}` }
          }
        );

        return {
          ...appt.toObject(),
          patientProfile: patientRes.data,
          doctorProfile: doctorRes.data
        };
      })
    );

    res.json({
      totalAppointments,
      totalPages: Math.ceil(totalAppointments / limit),
      currentPage: page,
      pageSize: limit,
      appointments: enrichedAppointments
    });
  } catch (err) {
    console.error(err);
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
