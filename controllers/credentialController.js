const Credential = require('../models/Credentials');
const sendEmail = require('../utilities/sendEmail');
const User = require('../models/user');

// 1. Upload Credential
exports.uploadCredential = async (req, res) => {
  try {
    const { name, department, matricNumber } = req.body;
    const files = req.files; // 🔥 grab all files

    const credential = new Credential({
      user: req.user.id,
      name,
      department,
      matricNumber,
      status: 'Pending', // ✅ now with the comma

      // Uploaded file paths
      bioDataForm: files.bioDataForm?.[0]?.path,
      jambUtmeResult: files.jambUtmeResult?.[0]?.path,
      oLevelResult: files.oLevelResult?.[0]?.path,
      refLetterPastor: files.refLetterPastor?.[0]?.path,
      refLetterSchool: files.refLetterSchool?.[0]?.path,
      jambAdmissionLetter: files.jambAdmissionLetter?.[0]?.path,
      auiAdmissionNotification: files.auiAdmissionNotification?.[0]?.path,
      birthCertificate: files.birthCertificate?.[0]?.path,

      courseReg100: files.courseReg100?.[0]?.path,
      courseReg200: files.courseReg200?.[0]?.path,
      courseReg300: files.courseReg300?.[0]?.path,
      courseReg400: files.courseReg400?.[0]?.path,
      courseReg500: files.courseReg500?.[0]?.path,

      matricOathForm: files.matricOathForm?.[0]?.path,
      ictBioData: files.ictBioData?.[0]?.path,
      bursaryClearance: files.bursaryClearance?.[0]?.path
    });

    await credential.save();

    // ✅ Send email to user
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
      .populate('user', 'firstName lastName email')
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

