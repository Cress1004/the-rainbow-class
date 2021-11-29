const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    class_name: String,
    description: String, 
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
    class_monitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    student_types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentType'
    }],
    volunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at', deleteAt: 'delete_at'}
  });

const ClassName = mongoose.model('ClassName', classSchema, 'classes');

module.exports = { ClassName }