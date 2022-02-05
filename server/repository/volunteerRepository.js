const { Volunteer } = require("../models/Volunteer");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");
const {
  VOLUNTEER_ROLE,
  SUPER_ADMIN,
  ADMIN,
  STUDENT_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const { User } = require("../models/User");
const { getStudentByUserId } = require("./studentRepository");

const storeVolunteer = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: VOLUNTEER_ROLE,
      class: data.class,
    });
    const newVolunteer = await new Volunteer({
      user: newUser._id,
    });
    return newVolunteer.save();
  } catch (error) {
    console.log("fail to store new volunteer");
  }
};

const getVolunteerById = async (id) => {
  try {
    return await Volunteer.findOne({ _id: id }).populate({
      path: "user",
      select: "name email phoneNumber gender image address class",
      populate: [
        { path: "address", select: "address description" },
        { path: "class", select: "name" },
      ],
    });
  } catch (error) {
    console.log("fail to get volunteer data by ID");
  }
};

const getVolunteerByIdAndClassId = async (id, classId) => {
  try {
    return await Volunteer.findOne({ _id: id, class: classId })
      .populate({ path: "class", select: "name" })
      .populate({
        path: "user",
        select: "name email phoneNumber gender image address",
        populate: { path: "address", select: "address description" },
      });
  } catch (error) {
    console.log("fail to get volunteer data by ID and class ID");
    return null;
  }
};

const getVolunteerByUserId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (user.role == VOLUNTEER_ROLE) {
      return await Volunteer.findOne({ user: user.id }).populate({
        path: "user",
        select: "name email phoneNumber gender image address",
        populate: { path: "address", select: "address description" },
        populate: { path: "class", select: "name" },
      });
    }
    return null;
  } catch (error) {
    console.log("fail to get volunteer data");
  }
};

const getListVolunteers = async (user) => {
  try {
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.role === SUPER_ADMIN) return null;
      if (currentVolunteer.role === ADMIN)
        return await Volunteer.find({}).populate({
          path: "user",
          select: "name email phoneNumber class",
          populate: { path: "class", select: "name" },
        });
      else {
        //TODO: get volunteer by class
        return await Volunteer.find({}).populate({
          path: "user",
          select: "name email phoneNumber class",
          populate: { path: "class", select: "name" },
        });
      }
    }
    if (user.role === STUDENT_ROLE) {
      const currentStudent = await getStudentByUserId(user._id);
      return await Volunteer.find({ class: currentStudent.class })
        .populate("user", "name email phoneNumber")
        .populate("class", "name");
    }
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

const deleteVolunteer = async (user, volunteerId) => {
  try {
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      console.log(currentVolunteer);
      if (
        currentVolunteer.role === ADMIN ||
        currentVolunteer.role === CLASS_MONITOR ||
        currentVolunteer.role === SUB_CLASS_MONITOR
      ) {
        const volunteer = await Volunteer.findOne({ _id: volunteerId });
        await deleteUser(volunteer.user._id);
        return await Volunteer.deleteOne({ _id: volunteerId });
      }
    } else return null;
  } catch (error) {
    console.log("Fail to delete user");
    return null;
  }
};

module.exports = {
  storeVolunteer,
  getListVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  getVolunteerByUserId,
  getVolunteerByIdAndClassId,
};
