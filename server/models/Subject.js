const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    title: String
});

const Subject = mongoose.model('Subject', subjectSchema, 'subjects');

module.exports = { Subject }
