const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parentName: String,
    studentTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentType",
      },
    ],
    interest: String,
    character: String,
    overview: String,
    birthday: String,
    admissionDay: String,
    retirementDate: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Number,
      default: 0, //0: studing, 1: retired
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

studentSchema.plugin(mongoose_delete, { deletedAt : true });
const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
