const express = require("express");
const router = express.Router();
const protect = require("../middleware/appointmentMiddleware"); 
const controller = require("../controllers/availabilityController");

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

// POST: Create availability
router.post("/", controller.createAvailability);

// GET: All availabilities for a doctor
router.get("/doctor/:doctorId", controller.getAvailabilityByDoctor);

// GET: Availability for a doctor on a specific date
router.get("/doctor/:doctorId/date/:date", controller.getAvailabilityByDoctorAndDate);

module.exports = router;
