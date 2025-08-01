const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
        authUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserData",
            required: true,
            unique: true,
        },

        specialization: { type: String, required: true,},
        experienceYears: {type: Number, required: true },
        education: { type: String, required: true, },
        bio: { type: String, maxlength: 1000,},
        clinicAddress: { type: String, },
        phone: { type: String, },
        availabilityNote: { type: String,},
    }, { timestamps: true, });

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);
