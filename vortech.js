const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv")
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');


dotenv.config();
const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());


// ROUTES
const authRoutes = require("./routes/auth");  
app.use("/api", authRoutes); 

const credentialRoutes = require('./routes/credentials');
app.use('/api/', credentialRoutes);

const fileRoutes = require("./routes/files");
app.use("/api/files", fileRoutes);


// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection error", err));


  app.get("/api", (req, res) => {
    res.send("✅ Final Clear API is running successfully");
  });

// START SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server is listening at Localhost ${process.env.PORT}`);
});
