const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    class_name: String,
    schedule_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
    class_monitor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adress',
    },
    detail: String
})

const ClassName = mongoose.model('ClassName', classSchema);

module.exports = { ClassName }