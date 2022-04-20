const mongoose = require('mongoose');

const pairTeachingSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer'
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName'
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    teachOption: Number,
    linkOnline: String,
    status: {
        type: Number,
        default: 0, // 0: unregister, 1: registered
      },
})

const PairTeaching = mongoose.model('PairTeaching', pairTeachingSchema);

module.exports = { PairTeaching }