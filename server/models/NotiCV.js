const mongoose = require("mongoose");

const NotiCVSchema = mongoose.Schema(
  {
    notification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
    }    
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deleteAt: "delete_at",
    },
  }
);

const NotiCV = mongoose.model("NotiCV", NotiCVSchema);

module.exports = { NotiCV };
