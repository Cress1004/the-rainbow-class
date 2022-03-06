const mongoose = require("mongoose");

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

const FreeTime = mongoose.model("FreeTime", FreeTimeSchema);

module.exports = { FreeTime };
