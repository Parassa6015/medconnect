const express = require('express');
const router = express.Router();

const {
  getDoctorProfileByUserId,
  updateDoctorProfile,
} = require("../controllers/DoctorProfileController");

// ✅ Use a custom route like this:
router.get('/:userId', getDoctorProfileByUserId);
router.put('/:userId', updateDoctorProfile);

module.exports = router;
