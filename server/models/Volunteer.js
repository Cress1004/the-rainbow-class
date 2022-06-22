const mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');

const volunteerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: Number,
      default: 1, // 1: volunteer, 2: class_monitor, 3: sub_class_monitor, 4: superadmin
    },
    isAdmin: Boolean,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

volunteerSchema.plugin(mongoose_delete, { deletedAt : true });
const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = { Volunteer };
