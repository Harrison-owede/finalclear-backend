const bcrypt = require("bcryptjs");

const hashPassword = async (Password) =>{
    const saltRounds = 10
    return await bcrypt.hash(Password, saltRounds);
};



module.exports = hashPassword;
    
