const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema({
    title: String
});

const Grade = mongoose.model('Grade', gradeSchema, 'grades');

module.exports = { Grade }
