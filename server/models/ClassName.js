const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    class_name: String,
    description: String, 
    address: {
        locationID: String,
        description: String
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
    class_monitor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    student_types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentType'
    }]
    // address_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Adress',
    // },
})

const ClassName = mongoose.model('ClassName', classSchema, 'classes');

module.exports = { ClassName }