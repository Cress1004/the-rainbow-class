const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    id: Number,
    name: String,
    districts: {
        type: mongoose.Schema.Types.Array,
        nested: {
            id: Number,
            name: String,
            wards: {
                type: mongoose.Schema.Types.Array,
                nested: {
                    id: Number,
                    name: String,
                }
            }
        }
    }
})

const Location = mongoose.model('Location', locationSchema);

module.exports = { Location }