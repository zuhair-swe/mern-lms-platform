const Teacher = require("../models/teacherSchema");
const Student = require("../models/studentSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user;

    // ========= TEACHER LOGIN =========
    if (role === "Teacher") {
      user = await Teacher.findOne({ email });

      if (!user || user.role !== "Teacher") {
        return res.status(404).json({ message: "Teacher not found" });
      }
      
      if(user.approve===false){
        return res.status(404).json({message:"Not approved!"})
      }
    }

    // ========= ADMIN LOGIN =========
    else if (role === "Admin") {
      user = await Teacher.findOne({ email });

      if (!user || user.role !== "Admin") {
        return res.status(404).json({ message: "Admin not found" });
      }
    }

    // ========= STUDENT LOGIN =========
    else if (role === "Student") {
      user = await Student.findOne({ email }).populate("teacher", "name");

      if (!user || user.role !== "Student") {
        return res.status(404).json({ message: "Student not found" });
      }
    }

    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ========= PASSWORD CHECK =========
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ========= TOKEN =========
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
