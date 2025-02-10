const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("./userModel.js");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing name, email or password" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    const savedUser = await newUser.save();

    const { password: _, ...userData } = savedUser._doc;

    res.status(201).json({
      msg: "User created successfully",
      user: userData,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2d" });

    res.json({
      msg: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
