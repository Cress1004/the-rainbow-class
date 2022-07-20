const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const LessonPlanSchema = mongoose.Schema({
    content: {
        type: String,
        maxLength: 5000,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at: Date,
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    reference: String
});

LessonPlanSchema.plugin(mongoose_delete, { deletedAt : true });
const LessonPlan = mongoose.model('LessonPlan', LessonPlanSchema);

module.exports = { LessonPlan };