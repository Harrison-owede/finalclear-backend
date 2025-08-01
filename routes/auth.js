const express = require("express");
const { registerUser } = require("../controllers/authControllersReg");
const { loginUser } = require("../controllers/authControllersLog");
const { forgotPassword, resetPassword } = require("../controllers/forgetResetPassControllers");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword);


module.exports = router;

