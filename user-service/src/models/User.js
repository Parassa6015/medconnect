const mongoose = require("mongoose");
const validator = require("validator");

const UserData = new mongoose.Schema({
  authUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  //  GET /api/appointment/filter?patientId=<authUserId> To use in frontend
  // {
  // "token": "...",
  // "user": {
  //   "id": "AUTH_USER_ID",
  //   "name": "...",
  //   "role": "user"
  // }
  // }
  firstName: { type: String, required: true },
  lastName: { type: String },
  gender: { type: String },
  dob: { type: Date},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address"
    }
  },
  address: { type: String},
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' }
});

module.exports = mongoose.model("UserData", UserData);
