const mongoose = require("mongoose");

const semesterSchema = mongoose.Schema({
  title: String,
  startDate: String,
  endDate: String,
});

const Semester = mongoose.model("Semester", semesterSchema, "semesters");

module.exports = { Semester };
