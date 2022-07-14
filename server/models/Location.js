const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

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

locationSchema.plugin(mongoose_delete, { deletedAt : true });
const Location = mongoose.model('Location', locationSchema, 'locations');

module.exports = { Location }