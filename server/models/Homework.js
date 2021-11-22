const mongoose = require('mongoose');

const homeworkSchema = mongoose.Schema({
    content: {
        type: String,
        maxLength: 5000,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    deadline: Date
});

const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = { Homework }