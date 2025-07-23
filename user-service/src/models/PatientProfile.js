const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
  authUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserData",
    unique: true, // One profile per user
  },
  allergies: [String],
  medicalConditions: [String],
  medications: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  notes: String, // Optional doctor notes
});

module.exports = mongoose.model("PatientProfile", patientProfileSchema);