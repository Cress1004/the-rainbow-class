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
        description: data.address.description
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
}

module.exports = { storeNewSchedule, deleteSchedule, updateSchedule };
