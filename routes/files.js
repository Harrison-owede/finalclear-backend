const express = require("express");
const router = express.Router();
const { getPrivateFile } = require("../controllers/fileController");

// Instead of /view/:publicId, use a query param
router.get("/view", getPrivateFile);

module.exports = router;
