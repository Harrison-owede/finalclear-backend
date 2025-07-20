const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  matricNumber: String,
  department: String,
  jambUtmeResult: String,
  oLevelResult: String,
  
  jambAdmissionLetter: String,
  

  



  status: { type: String, default: 'Pending' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credential', credentialSchema);
