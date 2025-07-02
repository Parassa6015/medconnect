const mongoose = require("mongoose");
const validator = require("validator");

const UserData = new mongoose.Schema({
  authUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
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
  address: { type: String, required: true }
});

module.exports = mongoose.model("UserData", UserData);
