const mongoose = require("mongoose");

const pairTeachingSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassName",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  teachOption: Number,
  linkOnline: String,
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
  },
  numberOfLessonsPerWeek: Number,
  status: {
    type: Number,
    default: 0, // 0: unregister, 1: registered & waitting, 2: paired
  },
});

const PairTeaching = mongoose.model("PairTeaching", pairTeachingSchema);

module.exports = { PairTeaching };
