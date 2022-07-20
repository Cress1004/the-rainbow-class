const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const achievementSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  },
  point: Number,
  maxPoint: Number,
  comment: String,
});

achievementSchema.plugin(mongoose_delete, { deletedAt: true });
const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = { Achievement };
