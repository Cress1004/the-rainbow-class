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
    }
})

const PairTeaching = mongoose.model('PairTeaching', pairTeachingSchema);

module.exports = { PairTeaching }