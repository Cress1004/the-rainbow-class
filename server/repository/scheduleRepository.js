const { Schedule } = require("../models/Schedule");
const { storeAddress } = require("./commonRepository");

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

module.exports = { storeNewSchedule, deleteSchedule };
