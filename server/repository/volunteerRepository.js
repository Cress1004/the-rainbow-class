const { Volunteer } = require("../models/Volunteer");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");
const { storeAddress, updateAddress } = require("./commonRepository");

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
      .populate("user", "name email phone_number gender image")
      .populate("class", "class_name")
      .populate("address");
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

const updateVolunteer = async (data) => {
  try {
    const volunteer = await Volunteer.findOne({_id: data.id});
    const userData = {
      id: volunteer.user._id,
      name: data.name,
      gender: data.gender,
    };
    await updateUserData(userData);
    if (volunteer.address) {
      await updateAddress(volunteer.address, data.address);
    } else {
      const address = await storeAddress(data.address);
      volunteer.address = address._id;
    }
    console.log(data.phoneNumber)
    volunteer.phone_number = data.phoneNumber;
    return volunteer.save();
  } catch (error) {
    console.log("fail to update volunteer");
  }
};

const deleteVolunteer = async (id) => {
  const volunteer = await Volunteer.findOne({_id: id})
  await deleteUser(volunteer.user._id);
  return await Volunteer.deleteOne({ _id: id });
};


module.exports = {
  storeVolunteer,
  getListVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer
};
