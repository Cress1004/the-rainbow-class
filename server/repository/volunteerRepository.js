const { Volunteer } = require("../models/Volunteer");
const { storeUser } = require("./userRepository");

const storeVolunteer = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
    });
    const newVolunteer = await new Volunteer({
      phone_number: data.phone_number,
      class: data.class,
      user: newUser._id,
    });
    return newVolunteer.save();
  } catch (error) {
    console.log("fail to store new volunteer");
  }
};

module.exports = { storeVolunteer };
