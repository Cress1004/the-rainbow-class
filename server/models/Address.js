const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const addressSchema = mongoose.Schema({
    description: String,
    address: {
        province: {
            id: String, 
            name: String
        },
        district: {
            id: String, 
            name: String
        },
        ward: {
            id: String, 
            name: String
        }
    }
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at', deleteAt: 'delete_at'}
});

addressSchema.plugin(mongoose_delete, { deletedAt : true });
const Address = mongoose.model('Address', addressSchema, "address");

module.exports = { Address }