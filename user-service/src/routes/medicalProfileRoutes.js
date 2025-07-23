const express = require('express');
const router = express.Router();
const medicalProfileController = require('../controllers/medicalProfileController');
const protect = require('../middleware/userMiddleware'); // 🔒 JWT-based user protection

// GET patient's medical profile by userId
router.get('/:userId', protect, medicalProfileController.getMedicalProfileByUserId);

// UPDATE or CREATE medical profile for a patient
router.put('/:userId', protect, medicalProfileController.updateMedicalProfile);

module.exports = router;
