const bcrypt = require("bcryptjs");

const comparePassword = async(plainText, hashedPassword) =>{
    return await bcrypt.compare(plainText, hashedPassword)
};

module.exports = comparePassword;