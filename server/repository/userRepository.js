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

module.exports = { storeUser };
