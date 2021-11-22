const mongoose = require('mongoose');

const requestFormSchema = mongoose.Schema({
    request_type_id: {
        type: Number,
        default: 0      // 0: absent request, 1: stop working
    },
    request_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        maxLength: 500,
    },
    create_at: Date,
    approve_at: Date,
    status: {
        type: Number,
        default: 0      // 0: pending, 1: approved, 2: reject
    }
})

const RequestForm = mongoose.model('RequestForm', requestFormSchema);

module.exports = { RequestForm }