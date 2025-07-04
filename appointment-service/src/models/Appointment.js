const mongoose = require("mongoose");

const rescheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  reason: { type: String }
});

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, required: true },
    timeslot: { type: String, required: true },
    status: {  type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending'},
    isFirstTimeVisit: { type: Boolean, required: true },
    notes: { type: String },
    meetingLink: {type: String},
    reasonForVisit: {type: String},
    paymentStatus: {type: String, enum: ["pending", "paid", "refunded"],default: "pending"},
    durationMinutes: {type: Number, default: 30},
    followUpRequired: {type: Boolean,default: false},
    cancellationReason: {type: String},
    rescheduleHistory: [rescheduleSchema]},
    {timestamps: true}
);

module.exports = mongoose.model("Appointment", appointmentSchema);
