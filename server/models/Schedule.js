const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    schedule_type: {
        type: Number,
        default: 0      // 0: lesson, 1: meeting, 2: interview
    },
    person_in_charge: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    paticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    start_time: Date,
    end_time: Date,
})

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = { Schedule }