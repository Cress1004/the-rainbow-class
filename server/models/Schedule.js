const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  scheduleType: {
    type: Number,
    default: 0, // 0: lesson, 1: meeting, 2: interview
  },
  personInCharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  teachOption: Number,
  linkOnline: String,
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  time: {
    key: Number,
    date: String,
    startTime: String,
    endTime: String,
    dayOfWeek: Number, // 0: All, 1: Sun, 2: Mon, ... , 7: Sat
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = { Schedule };
