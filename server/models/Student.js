const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentName: String,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName',
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favourite',
    }],
    studentTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentType',
    }]
})

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student }