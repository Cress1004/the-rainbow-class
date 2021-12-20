const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const studentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    birthday: Date,
    parent_name: String,
    address : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    phone_number: String,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName',
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favourite',
    }],
    student_types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentType',
    }]
})

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student }