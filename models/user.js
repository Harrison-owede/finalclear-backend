const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    department : String,
    matricNumber : String,
    email : {type : String, unique : true},
    phoneNumber : String,
    password : String,
    dob : String,
});

module.exports = mongoose.model('User', userSchema);