const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    classMonitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
    subClassMonitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
    studentTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentType",
      },
    ],
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
      },
    ],
    schedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],
    defaultSchedule: [
      {
        key: Number,
        startTime: Date,
        endTime: Date,
        dayOfWeek: Number, // 0: All, 1: Sun, 2: Mon, ... , 7: Sat
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deleteAt: "delete_at",
    },
  }
);

const ClassName = mongoose.model("ClassName", classSchema, "classes");

module.exports = { ClassName };
