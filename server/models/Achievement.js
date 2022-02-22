const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    point: Number,
    maxPoint: Number,
    comment: String,
})

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = { Achievement }