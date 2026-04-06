const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/videos", require("./routes/videos"));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("✅ DB Connected"))
.catch(err => console.log(err));

// server start
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});