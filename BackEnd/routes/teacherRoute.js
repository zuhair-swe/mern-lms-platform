const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authuntication");
const { login } = require("../controllers/loginController");
const { signup, getStudentById, updateStudent } = require("../controllers/teacherController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/students/:studentId", auth, getStudentById);
router.put("/students/:studentId",auth, updateStudent),

module.exports = router;
