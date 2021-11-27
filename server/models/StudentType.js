const mongoose = require('mongoose');

const studentTypeSchema = mongoose.Schema({
    title: String
});

const StudentType = mongoose.model('StudentType', studentTypeSchema, 'studentTypes');

module.exports = { StudentType }
