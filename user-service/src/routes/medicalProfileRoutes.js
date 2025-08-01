const express = require('express');
const router = express.Router();

const {
  getMedicalProfileByUserId,
  updateMedicalProfile,
} = require("../controllers/medicalProfileController");

// ✅ Use a custom route like this:
router.get('/by-user/:userId', getMedicalProfileByUserId);
router.put('/by-user/:userId', updateMedicalProfile);

module.exports = router;
