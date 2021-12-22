const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    scheduleType: {
        type: Number,
        default: 0      // 0: lesson, 1: meeting, 2: interview
    },
    personInCharge: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    paticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    startTime: Date,
    endTime: Date,
})

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = { Schedule }