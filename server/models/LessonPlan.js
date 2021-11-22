const mongoose = require('mongoose');

const LessonPlanSchema = mongoose.Schema({
    content: {
        type: String,
        maxLength: 5000,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at: Date,
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    reference: String
});

const LessonPlan = mongoose.model('LessonPlan', LessonPlanSchema);

module.exports = { LessonPlan };