const mongoose = require("mongoose");

const lessonSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: 128,
  },
  description: {
    type: String,
    maxLength: 1000,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
  },
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
    },
  ],
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassName",
  },
  pairTeaching: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PairTeaching"
  }
}, {
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at', deleteAt: 'delete_at'}
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = { Lesson };
