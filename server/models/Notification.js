const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: Number, // 0: newCV, ...
    read: {
      type: Boolean,
      default: false, //false: unread, true: read
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

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
