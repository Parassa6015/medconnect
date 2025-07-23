const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      start: { type: String, required: true }, // e.g., "09:00"
      end: { type: String, required: true },   // e.g., "09:30"
      isBooked: { type: Boolean, default: false },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("DoctorAvailability", availabilitySchema);
