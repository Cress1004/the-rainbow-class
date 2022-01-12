const { Schedule } = require("../models/Schedule");
const { storeAddress, updateAddress } = require("./commonRepository");

const storeNewSchedule = async (data) => {
  try {
    const address = storeAddress(data.address);
    const newSchedule = await new Schedule(data);
    newSchedule.address = address._id;
    newSchedule.save();
    return newSchedule;
  } catch (error) {
    console.log("fail to store Schedule");
  }
};

const deleteSchedule = async (id) => {
  try {
    return Schedule.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log("fail to store Schedule");
  }
};

const updateSchedule = async (data) => {
  try {
    const schedule = await Schedule.findOne({ _id: data._id });
    if (schedule.address) {
      await updateAddress(schedule.address, data.address);
    } else {
      const address = await storeAddress({
        address: data.address.address,
        description: data.address.description,
      });
      schedule.address = address._id;
    }
    schedule.teachOption = data.teachOption;
    schedule.linkOnline = data.linkOnline;
    schedule.time = data.time;
    return schedule.save();
  } catch (error) {
    console.log("fail to store Schedule");
  }
};

const addPaticipant = async (data) => {
  try {
    const schedule = await Schedule.findOne({ _id: data.scheduleId });
    schedule.paticipants.push(data.userId);
    schedule.save();
  } catch (error) {
    console.log("fail to add paticipant");
  }
};

const removePaticipant = async (data) => {
  try {
    const schedule = await Schedule.findOne({ _id: data.scheduleId });
    Promise.all(
      schedule.paticipants.filter((userId) => userId != data.userId)
    ).then((result) => {
      schedule.paticipants = result;
      schedule.save();
    });
  } catch (error) {
    console.log("fail to remove paticipant");
  }
};

const getAllSchedulesByVolunteer = async (data) => {
  try {
    return await Schedule.find({ paticipants: data });
  } catch (error) {
    console.log("fail to get user schedule");
  }
};

module.exports = {
  storeNewSchedule,
  deleteSchedule,
  updateSchedule,
  addPaticipant,
  removePaticipant,
  getAllSchedulesByVolunteer,
};
