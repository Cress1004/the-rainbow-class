const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentName: String,
    studentTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentType',
    }],
    interest: String,
    character: String,
    overview: String
})

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student }