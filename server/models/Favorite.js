const mongoose = require('mongoose');

const favouriteSchema = mongoose.Schema({
    title: String
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = { Favourite }
