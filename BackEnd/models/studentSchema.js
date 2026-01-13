const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password:{type: String, required:true},
  age: {
  type: Number,
  min: [18, "Age must be at least 18"],
  max: [45, "Age must be less than or equal to 45"],
  required: true
},
  class: {
    type: String,
    enum: ["BSSE", "BSCS", "BSIT", "BSITE", "BSAI"],
    required: true
},
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  role: {
  type: String,
  default: "Student",
},
  image:{type: String},

pendingDelete: {
  type: Boolean,
  default: false,
},
deleteRequestedAt: {
  type: Date,
  default: null,
},
deleteAfter: {
  type: Date,
  default: null,
},
});

module.exports = mongoose.model("Student", studentSchema);
