const mongoose = require('mongoose');

const requestFormSchema = mongoose.Schema({
    requestType: {
        type: Number,
        default: 0      // 0: absent request, 1: stop working
    },
    requestUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        maxLength: 500,
    },
    createAt: Date,
    approveAt: Date,
    status: {
        type: Number,
        default: 0      // 0: pending, 1: approved, 2: reject
    }
})

const RequestForm = mongoose.model('RequestForm', requestFormSchema);

module.exports = { RequestForm }