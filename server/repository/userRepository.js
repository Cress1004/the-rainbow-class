require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { DEFAULT_AVATAR_PATH } = require("../defaultValues/constant");
const { User } = require("../models/User");
const { storeAddress, updateAddress } = require("./commonRepository");

const storeUser = async (data) => {
  try {
    const address = storeAddress(data.address);
    const newUser = await new User({
      name: data.name,
      email: data.email,
      image: DEFAULT_AVATAR_PATH + "default-image.jpg",
      password: process.env.DEFAULT_PASSWORD,
      phoneNumber: data.phoneNumber,
      address: address._id,
      role: data.role,
      class: data.class,
      linkFacebook: data.linkFacebook,
    });
    return newUser.save();
  } catch (error) {
    console.log("fail to store new user");
  }
};

const getUserDataByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.log("fail to get user by Email");
  }
};

const getUserDataById = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    console.log("fail to get user's basic infor");
  }
};

const updateUserData = async (data) => {
  try {
    const user = await User.findOne({ _id: data.id });
    if (user.email !== data.email && (await checkDuplicateMail(data.email))) {
      return { message: "Duplicate Email" };
    } else {
      user.email = data.email;
      user.name = data.name;
      user.gender = data.gender;
      user.phoneNumber = data.phoneNumber;
      user.linkFacebook = data.linkFacebook;
      user.class = data.class;
      if (user.address) {
        await updateAddress(user.address, data.address);
      } else {
        const address = await storeAddress(data.address);
        user.address = address._id;
      }
      return user.save();
    }
  } catch (error) {
    console.log("fail to update user's basic infor");
    return null;
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

const updateProfile = async (currentUser, data) => {
  try {
    const user = await User.findOne({ _id: currentUser._id });
    user.email = data.email;
    user.name = data.name;
    user.phoneNumber = data.phoneNumber;
    user.linkFacebook = data.linkFacebook;
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

const changeAvatar = async (currentUser, newAvtLink) => {
  try {
    const user = await User.findOne({ _id: currentUser._id });
    user.image = newAvtLink;
    return user.save();
  } catch (error) {
    console.log("can't update user avatar");
  }
};

const comparePassword = async (user, password) => {
  try {
    const match = await bcrypt.compare(password.oldPassword, user.password);
    return match;
  } catch (error) {
    console.log("cant compare password");
    return null;
  }
};

const checkChangePassword = async (data) => {
  try {
    const user = await User.findOne({ _id: data.userId }, (err, user) => {
      user.comparePassword(data.oldPass, (err, isMatch) => {
        if (!isMatch) {
          return { message: "Password is not match" };
        } else {
          user.password = data.newPass;
          user.save();
          return;
        }
      });
    });
  } catch (error) {
    console.log("can't update password");
  }
};

const checkDuplicateMail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    console.log("cannot check duplicate email");
    return true;
  }
};

const findUserByToken = async (token) => {
  try {
    var decoded = jwt.verify(token, "secret");
    return await User.findOne({ _id: decoded, token: token });
  } catch (error) {
    console.log("Cannot find user by token");
    return null;
  }
};

const getUserByVolunteer = async (volunteer) => {
  try {
    return await User.findOne({ _id: volunteer.user });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const generateTokenToResetPassword = async (email) => {
  try {
    var user = await getUserDataByEmail(email);
    var token = crypto.randomBytes(64).toString("hex");
    user.token = token;
    return user.save();
  } catch (error) {
    return error;
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
  getUserDataById,
  getUserDataByEmail,
  checkDuplicateMail,
  findUserByToken,
  comparePassword,
  getUserByVolunteer,
  generateTokenToResetPassword
};
