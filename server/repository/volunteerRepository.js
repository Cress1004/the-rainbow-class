const { Volunteer } = require("../models/Volunteer");
const { User } = require("../models/User");
const {
  VOLUNTEER_ROLE,
  SUPER_ADMIN,
  STUDENT_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
const {
  storeUser,
  updateUserData,
  deleteUser,
  getUserByVolunteer,
} = require("./userRepository");
const {
  findAllWithUserPopulatedFields,
} = require("../services/queryByParamsServices");
const { createNotiUpgradeMonitorRole, createNotiDownMonitorRole } = require("./notificationRepository");

const storeVolunteer = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: VOLUNTEER_ROLE,
      class: data.class,
      linkFacebook: data.linkFacebook,
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
      select: "name email phoneNumber gender image address class linkFacebook",
      populate: [
        { path: "address", select: "address description" },
        { path: "class" },
      ],
    });
  } catch (error) {
    console.log("fail to get volunteer data by ID");
  }
};

const getVolunteerByIdAndClassId = async (volunteerData, classId) => {
  try {
    return await Volunteer.findOne({ _id: volunteerData._id, class: classId })
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
        select: "name email phoneNumber gender image address role linkFacebook",
        populate: { path: "address", select: "address description" },
        populate: { path: "class" },
      });
    }
    return null;
  } catch (error) {
    console.log("fail to get volunteer data");
  }
};

const getListVolunteers = async (user, params) => {
  try {
    if (user.role === STUDENT_ROLE) {
      return await findAllWithUserPopulatedFields(
        Volunteer,
        ["name", "email", "phoneNumber"],
        user.class,
        {
          limit: parseInt(params.limit),
          offset: (params.offset - 1) * 10,
          query: {},
          // query: {isAdmin: true, deleted: false},
          search: params.search,
          sort: ["created_at_asc"],
        }
      );
    }
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.isAdmin)
        return await findAllWithUserPopulatedFields(
          Volunteer,
          ["name", "email", "phoneNumber"],
          null,
          {
            limit: parseInt(params.limit),
            offset: (params.offset - 1) * 10,
            query: params.query ? JSON.parse(params.query) : {},
            search: params.search,
            sort: ["created_at_asc"],
          }
        );
      else {
        return await findAllWithUserPopulatedFields(
          Volunteer,
          ["name", "email", "phoneNumber"],
          user.class,
          {
            limit: parseInt(params.limit),
            offset: (params.offset - 1) * 10,
            query: {},
            // query: {isAdmin: true, deleted: false},
            search: params.search,
            sort: ["created_at_asc"],
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const getVolunteerByClassId = async (classId) => {
  try {
    const allVolunteers = await Volunteer.find({}).populate({
      path: "user",
      select:
        "name email phoneNumber gender image address role linkFacebook class",
      populate: [
        { path: "address", select: "address description" },
        { path: "class", select: "_id name" },
      ],
    });
    const vol = allVolunteers.filter((item) =>
      compareObjectId(item.user.class?._id, classIdx)
    );
    return vol;
  } catch (error) {
    console.log(error);
    return null;
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
      linkFacebook: data.linkFacebook,
      class: data.className,
    });
    return volunteer.save();
  } catch (error) {
    console.log(error);
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
      select:
        "name email phoneNumber gender image address role linkFacebook class",
      populate: [
        { path: "address", select: "address description" },
        { path: "class", select: "_id name" },
      ],
    });
    const vol = allVolunteers.filter((item) =>
      compareObjectId(item.user.class?._id, className._id)
    );
    return vol;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const downgradeMonitor = async (currentClass) => {
  try {
    if (currentClass.classMonitor) {
      const monitor = await Volunteer.findOne({
        _id: currentClass.classMonitor,
      });
      const userMonitor = await getUserByVolunteer(monitor);
      monitor.role = 1;
      await monitor.save();
      await createNotiDownMonitorRole(userMonitor._id, currentClass);
    }
    if (currentClass.subClassMonitor) {
      const subMonitor = await Volunteer.findOne({
        _id: currentClass.subClassMonitor,
      });
      const userSubMonitor = await getUserByVolunteer(subMonitor);
      subMonitor.role = 1;
      await subMonitor.save();
      await createNotiDownMonitorRole(userSubMonitor._id, currentClass);
    }
  } catch (error) {
    console.log("fail to downgrade monitor");
    return null;
  }
};

const upgradeMonitor = async (currentClass, monitorId, subMonitorId) => {
  try {
    if (monitorId && currentClass.monitorId !== monitorId) {
      const monitor = await Volunteer.findOne({ _id: monitorId });
      const userMonitor = await getUserByVolunteer(monitor);
      monitor.role = 2;
      await monitor.save();
      await createNotiUpgradeMonitorRole(userMonitor._id, currentClass, 2);
    }
    if (subMonitorId && currentClass.subClassMonitor !== subMonitorId) {
      const subMonitor = await Volunteer.findOne({ _id: subMonitorId });
      const userSubMonitor = await getUserByVolunteer(subMonitor);
      subMonitor.role = 3;
      await subMonitor.save();
      await createNotiUpgradeMonitorRole(userSubMonitor._id, currentClass, 3);
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

const getAllAdmin = async () => {
  try {
    const admin = await Volunteer.find({ isAdmin: true }).populate({
      path: "user",
    });
    return admin;
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const getAdminList = async (params) => {
  try {
    const result = await findAllWithUserPopulatedFields(
      Volunteer,
      ["name", "email", "phoneNumber"],
      null,
      {
        limit: parseInt(params.limit),
        offset: (params.offset - 1) * 10,
        query: { isAdmin: true, deleted: false },
        search: params.search,
        sort: ["created_at_dsc"],
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const getAllVolunteers = async () => {
  try {
    const volunteers = await Volunteer.find({});
    return volunteers;
  } catch (error) {
    console.log(error);
    return { message: error };
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
  getVolunteerByClass,
  downgradeMonitor,
  upgradeMonitor,
  getCurrentClassMonitor,
  getCurrentClassMonitorAndAdmin,
  getAllAdmin,
  getAllVolunteers,
  getAdminList,
  getVolunteerByClassId,
};
