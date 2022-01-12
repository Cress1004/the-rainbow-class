const { Volunteer } = require("../models/Volunteer");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");
const { VOLUNTEER_ROLE } = require("../defaultValues/constant");
const { User } = require("../models/User");

const storeVolunteer = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: VOLUNTEER_ROLE,
    });
    const newVolunteer = await new Volunteer({
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
      .populate({ path: "class", select: "name" })
      .populate({
        path: "user",
        select: "name email phoneNumber gender image address",
        populate: { path: "address", select: "address description" },
      });
  } catch (error) {
    console.log("fail to get volunteer data");
  }
};

const getVolunteerByUserId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (user.role == VOLUNTEER_ROLE) {
      return await Volunteer.findOne({ user: user.id })
        .populate({ path: "class", select: "name" })
        .populate({
          path: "user",
          select: "name email phoneNumber gender image address",
          populate: { path: "address", select: "address description" },
        });
    }
    return null;
  } catch (error) {
    console.log("fail to get volunteer data");
  }
};

const getListVolunteers = async () => {
  try {
    return await Volunteer.find({})
      .populate("user", "name email phoneNumber")
      .populate("class", "name");
  } catch (error) {
    console.log("fail to get list volunteers");
  }
};

const updateVolunteer = async (data) => {
  try {
    const volunteer = await Volunteer.findOne({ _id: data.id });
    await updateUserData({
      id: volunteer.user._id,
      email: data.email,
      name: data.name,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      address: data.address,
    });
    return volunteer.save();
  } catch (error) {
    console.log("fail to update volunteer");
  }
};

const deleteVolunteer = async (id) => {
  const volunteer = await Volunteer.findOne({ _id: id });
  await deleteUser(volunteer.user._id);
  return await Volunteer.deleteOne({ _id: id });
};

module.exports = {
  storeVolunteer,
  getListVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  getVolunteerByUserId
};
