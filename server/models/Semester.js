const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const semesterSchema = mongoose.Schema({
  title: String,
  startDate: String,
  endDate: String,
});

semesterSchema.plugin(mongoose_delete, { deletedAt : true });
const Semester = mongoose.model("Semester", semesterSchema, "semesters");

module.exports = { Semester };
