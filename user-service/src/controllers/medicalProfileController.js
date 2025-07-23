const MedicalProfile = require('../models/PatientProfile');

exports.getMedicalProfileByUserId = async (req, res) => {
  try {
    const profile = await MedicalProfile.findOne({ authUserId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateMedicalProfile = async (req, res) => {
  try {
    const updated = await MedicalProfile.findOneAndUpdate(
      { authUserId: req.params.userId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

