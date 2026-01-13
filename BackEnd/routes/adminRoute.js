const express = require("express");
const router = express.Router();
const adminauth = require("../middlewares/adminauth")
const { login } = require("../controllers/loginController");
const { createAdmin, getAllStudents, scheduleStudentDelete, cronDeleteStudents } = require("../controllers/adminController");

router.post("/create", createAdmin);
router.post("/login", login);
router.get("/students",adminauth, getAllStudents);
router.post("/students/schedule-delete", adminauth, scheduleStudentDelete);
// Only cron should call this
// This route exists only for manual testing or debugging
// router.delete("/students/cron-delete", cronDeleteStudents);



module.exports = router;
