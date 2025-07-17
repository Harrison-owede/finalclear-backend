const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const checkAdmin = require('../middleware/checkAdmin');
const {
  uploadCredential,
  getAllCredentials,
  updateCredentialStatus,
  getMyCredential
} = require('../controllers/credentialController');

const authenticateUser = require('../middleware/authenticate'); // your JWT middleware

router.post(
  '/upload',
  authenticateUser,
  upload.fields([
    { name: 'bioDataForm' },
    { name: 'jambUtmeResult' },
    { name: 'oLevelResult' },
    { name: 'refLetterPastor' },
    { name: 'refLetterSchool' },
    { name: 'jambAdmissionLetter' },
    { name: 'auiAdmissionNotification' },
    { name: 'birthCertificate' },
    { name: 'courseReg100' },
    { name: 'courseReg200' },
    { name: 'courseReg300' },
    { name: 'courseReg400' },
    { name: 'courseReg500' },
    { name: 'matricOathForm' },
    { name: 'ictBioData' },
    { name: 'bursaryClearance' }
  ]),
  uploadCredential
);
// Student uploads
router.get('/admin/credentials', authenticateUser, checkAdmin, getAllCredentials); // Admin views all
router.patch('/admin/credentials/:id', authenticateUser, checkAdmin, updateCredentialStatus); // Admin updates
router.get('/my-credential', authenticateUser, getMyCredential);


module.exports = router;
