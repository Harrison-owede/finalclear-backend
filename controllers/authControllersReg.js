const User = require("../models/user");
const hashPassword = require("../utilities/hashutilities");
const registerValidations = require("../validations/registerValidations");
const generateToken = require("../utilities/generateToken");



const registerUser = async (req, res) => {

    // Validate the request body using joi

const {error} = registerValidations.validate(req.body);
if(error){
 return res.status(400).json({error : error.details[0].message})
}
const { firstName, lastName,  matricNumber, email, phoneNumber, password, confirmPassword,  } = req.body;

    // console.log("Incoming request body:", req.body);
  
    if (!firstName || !lastName || !matricNumber || !email || !phoneNumber || !password || !confirmPassword ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
  
    try {
      const userExist = await User.findOne({ email });
      if (userExist) return res.status(400).json({ error: "User already exists" });
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = new User({
        firstName,
        lastName,
        matricNumber,
        email,
        phoneNumber,
        password: hashedPassword,
      
      });
  
       const savedUser = await newUser.save();
       const token = generateToken(savedUser._id)
       res.status(201).json({
        message: "Registration Successful",
        token,
        user: {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          matricNumber: savedUser.matricNumber
        }
      });


    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

  module.exports= {registerUser};
  
