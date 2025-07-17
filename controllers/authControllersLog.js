const User = require("../models/user");
const jwt = require('jsonwebtoken');



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};


const loginUser = async (req, res) => {

    const { email, password } = req.body;
  
    // Validate
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'No user found' });
  
      const bcrypt = require('bcryptjs');
      const valid = await bcrypt.compare(password, user.password);

      // const hash = await bcrypt.hash('admin123', 10);
      //  console.log(hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });



  
      const token = generateToken(user._id); // make sure this is correct
  
      // Check if it's an admin
      if (user.status === 'admin') {
        return res.status(200).json({
          message: 'Admin login successful',
          token,
          role: 'admin',
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        });
      }
  
      // Otherwise normal student
      res.status(200).json({
        message: 'Student login successful',
        token,
        role: 'student',
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          matricNumber: user.matricNumber,
          department: user.department
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = { loginUser };