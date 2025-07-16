const express = require("express");
const router = express.Router();
const controller = require("../controllers/availabilityController");

// POST: Create availability
router.post("/", controller.createAvailability);

// GET: All availabilities for a doctor
router.get("/doctor/:doctorId", controller.getAvailabilityByDoctor);

// GET: Availability for a doctor on a specific date
router.get("/doctor/:doctorId/date/:date", controller.getAvailabilityByDoctorAndDate);

module.exports = router;
