const express = require("express");



const { registerUser } = require("../controllers/authControllersReg");
const { loginUser } = require("../controllers/authControllersLog");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
