const mongoose = require("mongoose");

const CVSchema = mongoose.Schema(
  {
    userName: String,
    phoneNumber: String,
    email: String,
    cvFileLink: String,
    audioFileLink: String,
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassName",
    },
    status: {
      type: Number,
      default: 0, //0: pending, 1: waitting for interview, 2: passed, 3: fail
    },
    note: String,
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deleteAt: "delete_at",
    },
  }
);

const CV = mongoose.model("CV", CVSchema, "cv");

module.exports = { CV };
