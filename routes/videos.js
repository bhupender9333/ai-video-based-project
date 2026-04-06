const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../models/video");
const auth = require("../middleware/auth");

// storage config
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,"uploads/");
  },
  filename: (req,file,cb)=>{
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({storage});

// UPLOAD VIDEO
router.post("/upload", auth, upload.single("video"), async (req,res)=>{
  try {
    const video = await Video.create({
      title: req.body.title,
      file: req.file.path,
      uploadedBy: req.user.id
    });

    res.json(video);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// GET ALL VIDEOS
router.get("/", auth, async (req,res)=>{
  try {
    const videos = await Video.find({uploadedBy:req.user.id});
    res.json(videos);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;