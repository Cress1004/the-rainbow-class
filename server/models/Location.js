const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    id: String,
    name: String,
    districts: {
        type: mongoose.Schema.Types.Array,
        nested: {
            id: String,
            name: String,
            wards: {
                type: mongoose.Schema.Types.Array,
                nested: {
                    id: String,
                    name: String,
                }
            }
        }
    }
})

const Location = mongoose.model('Location', locationSchema, 'locations');

module.exports = { Location }