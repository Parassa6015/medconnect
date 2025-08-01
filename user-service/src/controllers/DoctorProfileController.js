const DoctorProfile = require("../models/DoctorProfile");

// @desc    Get doctor profile by user ID
// @route   GET /api/doctor-profiles/:userId
exports.getDoctorProfileByUserId = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ authUserId: req.params.userId });

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create or update doctor profile by user ID
// @route   PUT /api/doctor-profiles/:userId
exports.updateDoctorProfile = async (req, res) => {
  try {
    const updated = await DoctorProfile.findOneAndUpdate(
      { authUserId: req.params.userId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
