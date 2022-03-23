const { Volunteer } = require("../models/Volunteer");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");
const {
  VOLUNTEER_ROLE,
  SUPER_ADMIN,
  STUDENT_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const { User } = require("../models/User");
const { compareObjectId } = require("../function/commonFunction");

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
        populate: [
          { path: "address", select: "address description" },
          { path: "class", select: "name" },
        ],
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
    const allVolunteersData = await Volunteer.find({}).populate({
      path: "user",
      select: "name email phoneNumber class",
      populate: { path: "class" },
    });
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.role === SUPER_ADMIN) return null;
      if (currentVolunteer.isAdmin) return allVolunteersData;
      else {
        return allVolunteersData.filter(
          (item) => item.user.class._id.toString() === user.class.toString()
        );
      }
    }
    if (user.role === STUDENT_ROLE) {
      return allVolunteersData.filter((item) =>
        compareObjectId(item.user.class._id, user.class)
      );
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
      if (
        currentVolunteer.isAdmin ||
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

const getVolunteerByClass = async (className) => {
  try {
    const allVolunteers = await Volunteer.find({}).populate({
      path: "user",
      select: "name class",
    });
    const vol = allVolunteers.filter((item) =>
      compareObjectId(item.user.class._id, className._id)
    );
    return vol;
  } catch (error) {
    console.log("fail to get student by class");
    return null;
  }
};

const downgradeMonitor = async (currentClass) => {
  try {
    if (currentClass.classMonitor) {
      const monitor = await Volunteer.findOne({
        _id: currentClass.classMonitor,
      });
      monitor.role = 1;
      monitor.save();
    }
    if (currentClass.subClassMonitor) {
      const subMonitor = await Volunteer.findOne({
        _id: currentClass.subClassMonitor,
      });
      subMonitor.role = 1;
      subMonitor.save();
    }
  } catch (error) {
    console.log("fail to downgrade monitor");
    return null;
  }
};

const upgradeMonitor = async (monitorId, subMonitorId) => {
  try {
    if (monitorId) {
      const monitor = await Volunteer.findOne({ _id: monitorId });
      monitor.role = 2;
      monitor.save();
    }
    if (subMonitorId) {
      const subMonitor = await Volunteer.findOne({ _id: subMonitorId });
      subMonitor.role = 3;
      subMonitor.save();
    }
  } catch (error) {
    console.log("fail to upgrade monitor");
    return null;
  }
};

const getAllMonitorData = async () => {
  try {
    return await Volunteer.find({
      role: { $in: [SUB_CLASS_MONITOR, CLASS_MONITOR] },
    }).populate({
      path: "user",
    });
  } catch (error) {}
};

const getCurrentClassMonitor = async (classId) => {
  try {
    const monitors = await getAllMonitorData();
    return monitors.filter((item) =>
      compareObjectId(item.user.class._id, classId)
    );
  } catch (error) {}
};

const getCurrentClassMonitorAndAdmin = async (classId) => {
  try {
    const admin = await Volunteer.find({ isAdmin: true }).populate({
      path: "user",
    });
    const monitor = await getCurrentClassMonitor(classId);
    return [...new Set([...admin, ...monitor].map(JSON.stringify))].map(
      JSON.parse
    );
  } catch (error) {}
};

module.exports = {
  storeVolunteer,
  getListVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  getVolunteerByUserId,
  getVolunteerByIdAndClassId,
  getVolunteerByClass,
  downgradeMonitor,
  upgradeMonitor,
  getCurrentClassMonitor,
  getCurrentClassMonitorAndAdmin,
};
