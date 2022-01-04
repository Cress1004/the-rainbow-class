require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { storeAddress, updateAddress } = require("./commonRepository");

const storeUser = async (data) => {
  try {
    const address = storeAddress(data.address);
    const newUser = await new User({
      name: data.name,
      email: data.email,
      image: process.env.DEFAULT_IMAGE_PATH + "default-image.jpg",
      password: process.env.DEFAULT_PASSWORD,
      phoneNumber: data.phoneNumber,
      address: address._id,
    });
    return newUser.save();
  } catch (error) {
    console.log("fail to store new user");
  }
};

const updateUserData = async (data) => {
  try {
    const user = await User.findOne({ _id: data.id });
    user.email = data.email;
    user.name = data.name;
    user.gender = data.gender;
    user.phoneNumber = data.phoneNumber;
    if (user.address) {
      await updateAddress(user.address, data.address);
    } else {
      const address = await storeAddress(data.address);
      user.address = address._id;
    }
    return user.save();
  } catch (error) {
    console.log("fail to update user's basic infor");
  }
};

const deleteUser = async (id) => {
  return await User.deleteOne({ _id: id });
};

const getUserData = async (id) => {
  try {
    return await User.findOne({ _id: id }).populate(
      "address",
      "address description"
    );
  } catch (error) {
    console.log("can't get user infor");
  }
};

const updateProfile = async (data) => {
  try {
    const user = await User.findOne({ _id: data._id });
    user.email = data.email;
    user.name = data.name;
    user.phoneNumber = data.phoneNumber;
    if (user.address) {
      await updateAddress(user.address, data.address);
    } else {
      const address = await storeAddress(data.address);
      user.address = address._id;
    }
    return user.save();
  } catch (error) {
    console.log("can't update user infor");
  }
};

const changeAvatar = async (data) => {
  try {
    const user = await User.findOne({ _id: data._id });
    user.image = data.image;
    return user.save();
  } catch (error) {
    console.log("can't update user avatar");
  }
};

const checkChangePassword = async (data) => {
  try {
    var message;
    const user = await User.findOne({ _id: data.userId }, (err, user) => {
      user.comparePassword(data.oldPass, (err, isMatch) => {
        if (!isMatch) {
          message = "Old Password is not correct!";
        } else {
          user.password = data.newPass;
          user.save();
          return;
        }
      });
      return message;
    });
  } catch (error) {
    console.log("can't update password");
  }
};

module.exports = {
  storeUser,
  updateUserData,
  deleteUser,
  getUserData,
  updateProfile,
  changeAvatar,
  checkChangePassword,
};
