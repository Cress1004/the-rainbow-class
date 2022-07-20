const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

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

NotiCVSchema.plugin(mongoose_delete, { deletedAt : true });
const NotiCV = mongoose.model("NotiCV", NotiCVSchema);

module.exports = { NotiCV };
