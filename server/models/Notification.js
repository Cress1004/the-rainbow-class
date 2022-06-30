const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const NotificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: Number, // 0: newCV, 1: remind set monitor, 2: new lesson
    read: {
      type: Boolean,
      default: false, //false: unread, true: read
    },
    content: Object,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

NotificationSchema.plugin(mongoose_delete, { deletedAt : true });
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
