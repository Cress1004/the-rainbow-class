const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 128
    },
    detail: {
        type: String, 
        maxLength: 1000
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
    }],
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName'
    }
})

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = { Lesson }