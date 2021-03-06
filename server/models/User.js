const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");
var mongoose_delete = require('mongoose-delete');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      unique: 1,
    },
    phoneNumber: String,
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    birthday: Date,
    password: {
      type: String,
      minglength: 5,
    },
    gender: {
      type: Number,
      default: 0,
    },
    linkFacebook: String,
    image: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: Number,  // student: 0, volunteer: 1
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassName",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deleteAt: "delete_at",
    },
  }
);

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    // console.log('password changed')
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secret");
  var oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb (null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, "secret", function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.plugin(mongoose_delete, { deletedAt : true });
const User = mongoose.model("User", userSchema);

module.exports = { User };
