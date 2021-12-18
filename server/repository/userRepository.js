require("dotenv").config();
const { User } = require("../models/User");

const storeUser = async (data) => {
  try {
    const newUser = await new User({
      name: data.name,
      email: data.email,
      password: process.env.DEFAULT_PASSWORD,
    });
    return newUser.save();
  } catch (error) {
    console.log("fail to store new user");
  }
};

const updateUserData = async (data) => {
  try {
    const user = await User.findOne({ _id: data.id });
    user.name = data.name;
    user.gender = data.gender;
    return user.save();
  } catch (error) {
    console.log("fail to update volunteer's basic infor");
  }
};

module.exports = { storeUser, updateUserData };
