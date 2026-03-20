const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Teacher","Admin"], default: "Teacher"
  },
  approve: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);