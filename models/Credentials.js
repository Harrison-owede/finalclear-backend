const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  matricNumber: String,
  email: String,

  bioDataForm: String,
  jambUtmeResult: String,
  oLevelResult: String,
  refLetterPastor: String,
  refLetterSchool: String,
  jambAdmissionLetter: String,
  auiAdmissionNotification: String,
  birthCertificate: String,

  courseReg100: String,
  courseReg200: String,
  courseReg300: String,
  courseReg400: String,
  courseReg500: String, // Optional

  matricOathForm: String,
  ictBioData: String,
  bursaryClearance: String,

  status: { type: String, default: 'Pending' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credential', credentialSchema);
