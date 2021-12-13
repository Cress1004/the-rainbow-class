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

const getVolunteerById = async (id) => {
  try {
    return await Volunteer.findOne({ _id: id })
      .populate("user", "name email phone_number")
      .populate("class", "class_name");
  } catch (error) {
    console.log("fail to get volunteer data");
  }
};

const getListVolunteers = async () => {
  try {
    return (volunteers = await Volunteer.find({})
      .populate("user", "name email phone_number")
      .populate("class", "class_name"));
  } catch (error) {
    console.log("fail to get list volunteers");
  }
};

module.exports = { storeVolunteer, getListVolunteers, getVolunteerById };
