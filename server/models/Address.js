const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    detail: String,
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }
})

const Address = mongoose.model('Address', addressSchema);

module.exports = { Address }