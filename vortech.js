const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv")
const bodyParser = require("body-parser");


dotenv.config();
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json()); // required to parse JSON from requests
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
const authRoutes = require("./routes/auth");  // ✅ make sure the path is correct
app.use("/api", authRoutes);  // ✅ this adds /api/register endpoint

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection error", err));


  app.get("/api", (req, res) => {
    res.send("✅ Vortech API is running successfully");
  });

// START SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server is listening at Localhost ${process.env.PORT}`);
});
