const DoctorAvailability = require("../models/DoctorAvailability");
const protect = require("../middleware/appointmentMiddleware"); 

// Create availability
exports.createAvailability = async (req, res) => {
  try {
    const { doctorId, date, timeSlots } = req.body;

    if (!doctorId || !date || !timeSlots || !timeSlots.length) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const availability = new DoctorAvailability({ doctorId, date, timeSlots });
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

    const availability = await DoctorAvailability.findOne({
      doctorId,
      date: new Date(date),
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found." });
    }

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.post(
  "/",
  protect,
  (req, res, next) => {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can create availability." });
    }
    next();
  },
  controller.createAvailability
);
