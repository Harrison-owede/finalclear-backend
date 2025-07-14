const User = require("../models/user");
const comparePassword = require("../utilities/compareutilities");
const generateToken = require("../utilities/generateToken");
const loginValidations = require("../validations/loginValidations");


const loginUser = async (req, res)=>{

   const {error} = loginValidations.validate(req.body);
   if(error){
    return res.status(400).json({error : error.details[0].message})
   }

    const { email,  password } = req.body;
    // console.log("Incoming request body:", req.body);

    if(! email || !password){
        return res.status(404).json({error: "All fields required"});
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error : "Please register before log in"});
        }

        const bcrypt = require('bcryptjs');

        const isPasswordCorrect = await comparePassword(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(404).json({error: "Invalid password or email"})
        }

        const token = generateToken(user._id);

        res.status(201).json({
            message: "Login Successful",
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                matricNumber: user.matricNumber
            }
          });

    } catch (error) {
      res.status(404).json({error: "Error Logging in", error})  
    }

};

module.exports = {loginUser}


 