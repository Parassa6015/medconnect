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

// This is the new, unique route for fetching available dates for the calendar
router.get("/doctor/:doctorId/dates", controller.getAvailableDatesByDoctor);

router.get("/doctor/:doctorId/date/:date", controller.getAvailabilityByDoctorAndDate);

router.get("/doctor/:doctorId", controller.getAvailabilityByDoctor);

module.exports = router;