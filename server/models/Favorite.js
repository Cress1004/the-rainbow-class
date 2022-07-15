const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const favouriteSchema = mongoose.Schema({
    title: String
});

favouriteSchema.plugin(mongoose_delete, { deletedAt : true });
const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = { Favourite }
