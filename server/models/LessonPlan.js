const mongoose = require('mongoose');

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

const LessonPlan = mongoose.model('LessonPlan', LessonPlanSchema);

module.exports = { LessonPlan };