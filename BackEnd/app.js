const express = require("express");
const cors = require("cors");
const path = require("path")
require("dotenv").config();
require("./utils/delete");
// Cron jobs run inside the server, not through HTTP.

const connectDB = require("./config/mongoDb")

const teacherRoutes = require("./routes/teacherRoute");
const studentRoutes = require("./routes/studentRoute");
// const loginRoute = require("./routes/loginRoute")
const adminRoute = require("./routes/adminRoute")
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoute)
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
// app.use("/api/", loginRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB()

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
