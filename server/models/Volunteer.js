const mongoose = require('mongoose');

const volunteerSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    role : {
        type:Number,
        default: 0 // 0: volunteer, 1: class_monitor, 2: sub_class_monitor, 3: admin, 4: superadmin
    },
    gender : {
        type:Boolean,
        default:true
    },
    birthday: Date,
    address_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    phone_number: String,
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName',
    },   
})

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = { Volunteer }