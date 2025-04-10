const User = require("../models/user");
const hashPassword = require("../utilities/hashutilities");
const registerValidations = require("../validations/registerValidations");



const registerUser = async (req, res) => {

    // Validate the request body using joi

const {error} = registerValidations.validate(req.body);
if(error){
 return res.status(400).json({error : error.details[0].message})
}
    const { firstName, lastName, department, matricNumber, email, phoneNumber, password, dob } = req.body;
    // console.log("Incoming request body:", req.body);
  
    if (!firstName || !lastName || !department || !matricNumber || !email || !phoneNumber || !password || !dob) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const userExist = await User.findOne({ email });
      if (userExist) return res.status(400).json({ error: "User already exists" });
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = new User({
        firstName,
        lastName,
        department,
        matricNumber,
        email,
        phoneNumber,
        password: hashedPassword,
        dob,
      });
  
      await newUser.save();
      res.status(201).json({ message: "Registration Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

  module.exports= {registerUser};
  
