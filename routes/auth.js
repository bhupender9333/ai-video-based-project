const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// SIGNUP
router.post("/signup", async (req,res)=>{
  try {
    const {name,email,password} = req.body;

    // check user exists
    const exist = await User.findOne({email});
    if(exist) return res.status(400).json({msg:"User already exists"});

    const user = await User.create({name,email,password});

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({user,token});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// LOGIN
router.post("/login", async (req,res)=>{
  try {
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:"User not found"});

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({msg:"Wrong password"});

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({user,token});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;