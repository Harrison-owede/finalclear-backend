const Credential = require('../models/Credentials');
const sendEmail = require('../utilities/sendEmail');
const User = require('../models/user');

// 1. Upload Credential
exports.uploadCredential = async (req, res) => {
  try {
    const { name, department, matricNumber } = req.body;
    const files = req.files;

    // 🔐 Check if this user has already uploaded
    const existing = await Credential.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Credential already uploaded' });
    }

    const credential = new Credential({
      user: req.user.id,
      name,
      department,
      matricNumber,
      status: 'Pending',
      jambUtmeResult: files.jambUtmeResult?.[0]?.path,
      oLevelResult: files.oLevelResult?.[0]?.path,
      jambAdmissionLetter: files.jambAdmissionLetter?.[0]?.path,
    });

    await credential.save();

    const user = await User.findById(req.user.id);

    await sendEmail(
      user.email,
      'Credential Uploaded',
      `<p>Dear ${user.firstName},</p><p>Your credential has been uploaded successfully and is currently marked as: <b>Pending</b>.</p>`
    );

    res.status(201).json({ message: 'Credential uploaded and email sent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};



// 2. Get All Credentials (for Admin)
exports.getAllCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find()
      .populate('user', 'firstName lastName email matricNumber')
      .sort({ uploadedAt: -1 }); // optional: latest first

    res.json(credentials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
};

// 3. Update Credential Status (Approve / Deny)
exports.updateCredentialStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // Optional: Ensure only valid statuses are allowed
  if (!['Pending', 'Approved', 'Denied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const credential = await Credential.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    res.json({
      message: 'Credential status updated successfully',
      credential
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Status update failed' });
  }
};

exports.getMyCredential = async (req, res) => {
  try {
    const credential = await Credential.findOne({ user: req.user.id });
    if (!credential) return res.status(404).json({ message: 'No credential found' });

    res.json(credential);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch credential' });
  }
};

// controllers/adminControllerCheckingStudents.js
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const approved = await Credential.countDocuments({ status: 'Approved' });
    const denied = await Credential.countDocuments({ status: 'Denied' });
    const pending = await Credential.countDocuments({ status: 'Pending' });

    res.json({
      totalStudents,
      approved,
      denied,
      pending
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// controllers/credentialController.js
exports.editCredential = async (req, res) => {
  try {
    const studentId = req.user._id;

    const credential = await Credential.findOne({ student: studentId });

    if (!credential) {
      return res.status(404).json({ error: 'No credential found for this student' });
    }

    // Update fields if they exist in req.body
    credential.fullName = req.body.fullName || credential.fullName;
    credential.matricNumber = req.body.matricNumber || credential.matricNumber;
    credential.department = req.body.department || credential.department;

    // Update file uploads if new ones are provided
    if (req.files['jambUtmeResult']) {
      credential.jambUtmeResult = `/uploads/${req.files['jambUtmeResult'][0].filename}`;
    }
    if (req.files['oLevelResult']) {
      credential.oLevelResult = `/uploads/${req.files['oLevelResult'][0].filename}`;
    }
    if (req.files['jambAdmissionLetter']) {
      credential.jambAdmissionLetter = `/uploads/${req.files['jambAdmissionLetter'][0].filename}`;
    }

    await credential.save();
    res.json({ message: 'Credential updated successfully', credential });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during update' });
  }
};

//check students who have uploaded

exports.getUploadedStudents = async (req, res) => {
  try {
    const uploaded = await Credential.find().populate('user', 'firstName lastName email matricNumber');
    res.json(uploaded);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch uploaded credentials' });
  }
};

//Students Not uploaded

// GET /api/credentials/not-uploaded
exports.getStudentsWithoutUpload = async (req, res) => {
  try {
    const uploadedIds = await Credential.distinct('user');
    const notUploaded = await User.find({
      role: 'student',
      _id: { $nin: uploadedIds }
    }).select('firstName lastName email matricNumber');

    res.json(notUploaded);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students without uploads' });
  }
};


