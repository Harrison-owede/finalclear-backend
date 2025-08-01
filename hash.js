const bcrypt = require('bcryptjs');

const hash = async () => {
  const password = "admin3246"; // Or any secure admin password
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashed);
};

hash();