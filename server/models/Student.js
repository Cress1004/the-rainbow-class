const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const studentSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    gender : {
        type:Boolean,
        default:true    // true: male, false: female
    },
    birthday: Date,
    parent_name: String,
    address_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    phone_number: String,
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassName',
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favourite',
    }],
    student_types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
    }],
    image: String,
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
})


// studentSchema.pre('save', function( next ) {
//     var user = this;
    
//     if(user.isModified('password')){    
//         // console.log('password changed')
//         bcrypt.genSalt(saltRounds, function(err, salt){
//             if(err) return next(err);
    
//             bcrypt.hash(user.password, salt, function(err, hash){
//                 if(err) return next(err);
//                 user.password = hash 
//                 next()
//             })
//         })
//     } else {
//         next()
//     }
// });

// studentSchema.methods.comparePassword = function(plainPassword,cb){
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if (err) return cb(err);
//         cb(null, isMatch)
//     })
// }

// studentSchema.methods.generateToken = function(cb) {
//     var user = this;
//     console.log('user',user)
//     console.log('studentSchema', studentSchema)
//     var token =  jwt.sign(user._id.toHexString(),'secret')
//     var oneHour = moment().add(1, 'hour').valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;
//     user.save(function (err, user){
//         if(err) return cb(err)
//         cb(null, user);
//     })
// }

// studentSchema.statics.findByToken = function (token, cb) {
//     var user = this;

//     jwt.verify(token,'secret',function(err, decode){
//         user.findOne({"_id":decode, "token":token}, function(err, user){
//             if(err) return cb(err);
//             cb(null, user);
//         })
//     })
// }

const Student = mongoose.model('Student', studentSchema);

module.exports = { Student }