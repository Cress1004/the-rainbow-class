const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const FreeTimeSchema = mongoose.Schema(
  {
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
    },
    weekDay: Number,
    noon: Number,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deleteAt: "delete_at",
    },
  }
);

FreeTimeSchema.plugin(mongoose_delete, { deletedAt : true });
const FreeTime = mongoose.model("FreeTime", FreeTimeSchema);

module.exports = { FreeTime };
