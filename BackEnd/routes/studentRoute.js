
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authuntication");
const stdAuth = require("../middlewares/studentAuth");
const upload = require("../middlewares/upload")
const { login } = require("../controllers/loginController");
const { addStudent, getMyStudents, studentProfile, uploadStudentImage } = require("../controllers/studentController");

router.post("/login", login);
router.post("/add", auth, addStudent);
router.get("/my", auth, getMyStudents);
router.get("/profile", stdAuth, studentProfile);
router.post("/upload-image", stdAuth, upload.single("image"),uploadStudentImage)

module.exports = router;
