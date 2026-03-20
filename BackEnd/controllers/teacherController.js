const Teacher = require("../models/teacherSchema");
const Student = require("../models/studentSchema")
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

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { name, age, class: className } = req.body;

  try {
    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check ownership
    if (student.teacher.toString() !== req.teacherId) {
      return res.status(403).json({ message: "Not authorized to update this student" });
    }
    
    const stdAge = Number(req.body.age);

        if (!stdAge || stdAge < 18 || stdAge > 45) {
         return res.status(400).json({
         message: "Age must be between 18 and 45"
      });
    }
 const allowedClasses = ["BSSE", "BSCS", "BSIT", "BSITE", "BSAI"];

    if (!allowedClasses.includes(className)) {
      return res.status(400).json({ message: "Invalid class selected" });
}

    // Update fields
    student.name = name;
    student.age = Number(age);
    student.class = className;
    await student.save();

    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
