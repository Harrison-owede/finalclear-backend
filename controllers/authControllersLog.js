const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",  
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    // ✅ Send user info to frontend (no token!)
    res.status(200).json({
      message: "Login successful",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricNumber: user.matricNumber,
        department: user.department,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { loginUser };
