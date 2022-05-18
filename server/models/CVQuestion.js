const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const CVQuestionSchema = mongoose.Schema(
  {
    content: String,
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

CVQuestionSchema.plugin(mongoose_delete, { deletedAt : true });
const CVQuestion = mongoose.model("CVQuestion", CVQuestionSchema);

module.exports = { CVQuestion };
