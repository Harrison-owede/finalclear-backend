const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// SEND RESET EMAIL
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "No user with that email found" });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password</p>
        <p>This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
  
    if (!password || !confirmPassword) {
      return res.status(400).json({ error: "Both password fields are required" });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  




module.exports = {
  forgotPassword,
  resetPassword,
};

