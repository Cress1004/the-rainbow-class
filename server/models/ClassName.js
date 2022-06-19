const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const classSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
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
    teachingOption: {
      type: Number,
      default: 0,  // 0: teach by class, 1: 1-to-1 tutoring
    },
    defaultSchedule: [
      {
        key: Number,
        startTime: String,
        endTime: String,
        dayOfWeek: Number, // 0: All, 1: Sun, 2: Mon, ... , 7: Sat
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

classSchema.plugin(mongoose_delete, { deletedAt : true });
const ClassName = mongoose.model("ClassName", classSchema, "classes");

module.exports = { ClassName };
