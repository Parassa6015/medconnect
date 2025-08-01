const DoctorAvailability = require("../models/DoctorAvailability");

// Create availability
exports.createAvailability = async (req, res) => {
  try {
    const { doctorId, date, timeSlots } = req.body;

    if (!doctorId || !date || !timeSlots || !timeSlots.length) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Convert "2025-08-07" → Date object at UTC midnight
    const [year, month, day] = date.split("-");
    const dateOnly = new Date(Date.UTC(year, month - 1, day));

    const availability = new DoctorAvailability({ doctorId, date: dateOnly, timeSlots });
    await availability.save();

    res.status(201).json({ message: "Availability created.", availability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all availabilities for a doctor
exports.getAvailabilityByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const availabilities = await DoctorAvailability.find({ doctorId });
    res.json(availabilities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get availability for a specific date
exports.getAvailabilityByDoctorAndDate = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    console.log(date);
    const start = new Date(date);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const availability = await DoctorAvailability.findOne({
      doctorId,
      date: {
        $gte: start,
        $lte: end
      }
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found." });
    }

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



