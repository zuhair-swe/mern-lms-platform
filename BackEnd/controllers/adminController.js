const Teacher = require("../models/teacherSchema");
const Student = require("../models/studentSchema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = Teacher.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin"
    });

    await admin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // ✅ ADMIN QUERY (NO teacher filter)
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const students = await Student.find(query)
      .populate("teacher", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalStudents = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      totalStudents,
    });
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};
exports.scheduleStudentDelete = async (req, res) => {
  try {
    const { studentIds, delayMs } = req.body;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }


    const now = new Date();
    const deleteAfter = new Date(Date.now() + delayMs);

    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        pendingDelete: true,
        deleteRequestedAt: now,
        deleteAfter: deleteAfter,
      }
    );

    res.json({
      message: "Delete scheduled. Students will be deleted after 2 minutes.",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to schedule delete" });
  }
};

// Cron jobs run inside the server, not through HTTP.
exports.cronDeleteStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    const result = await Student.deleteMany({
      _id: { $in: studentIds },
      pendingDelete: true,
    });

    res.json({
      message: "Students deleted by cron",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Cron delete failed" });
  }
};
