const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    matricNumber : String,
    email : {type : String, unique : true},
    phoneNumber : String,
    password : String,
    department : String,
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    
    resetPasswordToken : String,
    resetPasswordTokenExpires : Date,

});

module.exports = mongoose.model('User', userSchema);