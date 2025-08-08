const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const checkAdmin = require('../middleware/checkAdmin');
const authenticateUser = require('../middleware/authenticate');
const User = require('../models/user');

const {
  uploadCredential,
  getAllCredentials,
  updateCredentialStatus,
  getMyCredential,
  getDashboardStats,
  editCredential,
  getUploadedStudents,
  getStudentsWithoutUpload,
} = require('../controllers/credentialController');

// Student Upload Credential
router.post(
  '/credentials',
  authenticateUser,
  upload.fields([
    { name: 'jambUtmeResult', maxCount: 1 },
    { name: 'oLevelResult', maxCount: 1 },
    { name: 'jambAdmissionLetter', maxCount: 1 },
  ]),
  uploadCredential
);

// Student Get My Credential
router.get('/my-credential', authenticateUser, getMyCredential);

// Student Edit Credential
router.put(
  '/edit-credentials',
  authenticateUser,
  upload.fields([
    { name: 'jambUtmeResult', maxCount: 1 },
    { name: 'oLevelResult', maxCount: 1 },
    { name: 'jambAdmissionLetter', maxCount: 1 },
  ]),
  editCredential
);

// Admin View All Credentials
router.get('/admin/credentials', authenticateUser, checkAdmin, getAllCredentials);

// Admin Update Status
router.patch('/admin/credentials/:id', authenticateUser, checkAdmin, updateCredentialStatus);

// Admin Stats Dashboard
router.get('/dashboard/stats', authenticateUser, checkAdmin, getDashboardStats);

// Admin See Uploaded Students
router.get('/credentials/uploaded', authenticateUser, checkAdmin, getUploadedStudents);

// Admin See Students Without Upload
router.get('/credentials/not-uploaded', authenticateUser, checkAdmin, getStudentsWithoutUpload);

// Admin Search Students by Name
router.get('/students/search', authenticateUser, checkAdmin, async (req, res) => {
  const searchTerm = req.query.name || '';
  try {
    const users = await User.find({
      role: 'student',
      $or: [
        { firstName: new RegExp(searchTerm, 'i') },
        { lastName: new RegExp(searchTerm, 'i') },
      ],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
