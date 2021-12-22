const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    content: {
        type: String,
        maxLengh: 5000,
    },
    created_at: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }
})

const Report = mongoose.model('Report', reportSchema);

module.exports = { Report };