const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const CVAnswerSchema = mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CVQuestion",
    },
    content: String,
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

CVAnswerSchema.plugin(mongoose_delete, { deletedAt: true });
const CVAnswer = mongoose.model("CVAnswer", CVAnswerSchema);

module.exports = { CVAnswer };
