const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    detail: String,
    // location: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Type',
    // },
})

const Address = mongoose.model('Address', addressSchema);

module.exports = { Address }