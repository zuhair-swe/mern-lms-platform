const Teacher = require("../models/teacherSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // if (!emailRegex.test(email)) {
    //   return res.status(400).json({ message: "Invalid Email" });
    // }
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword
    });
     await teacher.save();
    res.status(201).json({ message: "Signup successful" });
    
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

