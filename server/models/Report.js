const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const reportSchema = mongoose.Schema(
  {
    lessonDescription: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    pair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PairTeaching",
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

reportSchema.plugin(mongoose_delete, { deletedAt : true });
const Report = mongoose.model("Report", reportSchema);

module.exports = { Report };
