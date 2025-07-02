const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address'
    }
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'doctor', 'admin'], required: true },
  isApproved: { type: Boolean, default: true },
  medicalLicenseNumber: { type: String }
});

module.exports = mongoose.model('User', userSchema);
