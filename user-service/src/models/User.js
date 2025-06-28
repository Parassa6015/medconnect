const mongoose = require('mongoose');

const UserData = new mongoose.Schema({
    authUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    gender:{type: String, required: true},
    dob:{type: Date, required: true},
    email:{type: String,required: true},
    address:{type: String,required: true},
    role:{type: String, enum: ['user', 'doctor', 'admin'],
    default: 'user'}
});

module.exports = mongoose.model("userdata",UserData);