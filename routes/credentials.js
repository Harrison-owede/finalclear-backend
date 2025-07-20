const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const checkAdmin = require('../middleware/checkAdmin');
const User = require('../models/user')




const {
  uploadCredential,
  getAllCredentials,
  updateCredentialStatus,
  getMyCredential,
  getDashboardStats,
  editCredential,
  getUploadedStudents,
  getStudentsWithoutUpload
} = require('../controllers/credentialController');

const authenticateUser = require('../middleware/authenticate'); // your JWT middleware

router.post(
  '/upload',
  authenticateUser,
  upload.fields([
    
    { name: 'jambUtmeResult' },
    { name: 'oLevelResult' },
    { name: 'jambAdmissionLetter' },
    
  ]),
  uploadCredential
);
// Student uploads
router.get('/admin/credentials', authenticateUser, checkAdmin, getAllCredentials); // Admin views all
router.patch('/admin/credentials/:id', authenticateUser, checkAdmin, updateCredentialStatus); // Admin updates
router.get('/dashboard/stats', authenticateUser, checkAdmin, getDashboardStats );
router.get('/my-credential', authenticateUser, getMyCredential);
router.get('/credentials/uploaded', authenticateUser, checkAdmin, getUploadedStudents);
router.get('/credentials/not-uploaded', authenticateUser, checkAdmin, getStudentsWithoutUpload);



router.put(
  '/edit',
  authenticateUser,
  upload.fields([
    { name: 'jambUtmeResult' },
    { name: 'oLevelResult' },
    { name: 'jambAdmissionLetter' }
  ]),
  editCredential
);


router.get('/students/search', authenticateUser, checkAdmin, async (req, res) => {
  const searchTerm = req.query.name || '';
  try {
    const users = await User.find({
      role: 'student',
      $or: [
        { firstName: new RegExp(searchTerm, 'i') },
        { lastName: new RegExp(searchTerm, 'i') }
      ]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});


module.exports = router;
