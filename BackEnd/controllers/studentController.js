
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentSchema");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto")

exports.addStudent = async (req, res) => {
  try {
    const { name, email, age, className } = req.body;

    if (!name || !email ) {
      return res.status(400).json({ message: "Name and email required" });
    }
    const existing = await Student.findOne({email})
    if(existing){
      return res.status(400).json({ message: "email already exist" });
    }

    const stdAge = Number(req.body.age);

        if (!stdAge || stdAge < 18 || stdAge > 45) {
         return res.status(400).json({
         message: "Age must be between 18 and 45"
      });
}

    const allowedClasses = ["BSSE", "BSCS", "BSIT", "BSITE", "BSAI"];

    if (!allowedClasses.includes(req.body.className)) {
      return res.status(400).json({ message: "Invalid class selected" });
}


    const password = crypto.randomBytes(16).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      age,
      class: className,
      teacher: req.teacherId
    });

    await sendEmail(
      email,
      "Welcome to Student Portal",
      `Hello ${name},

You have been successfully added as a student.

Class: ${className},
LOGIN with given email and password.
Email: ${email},
Password: ${password}

Regards,
Teacher Management System 
    (ZUHAIR HUSSAIN)`
    );

    res.status(201).json({
      message: "Student added and email sent",
      student
    });

  } catch (error) {
    console.log("Add student error:", error);
    res.status(500).json({ message: "Failed to add student" });
  }
};

// Pagination and search
exports.getMyStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {
      teacher: req.teacherId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const students = await Student.find(query).populate("teacher","name")
      .skip(skip)
      .limit(limit);

    const totalStudents = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      totalStudents
    });
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};         

exports.studentProfile = async (req, res) => {
  try {
    const students = await Student.findById(req.studentId).populate("teacher","name");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

exports.uploadStudentImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const student = await Student.findByIdAndUpdate(
      req.studentId,
      { image: req.file.filename },
      { new: true }
    );

    res.json({
      message: "Image uploaded successfully",
      image: student.image,
    });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed" });
  }
};

