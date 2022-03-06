const { FreeTime } = require("../models/FreeTime");

const storeFreeTime = async (data) => {
  try {
    const newFreeTime = await new FreeTime(data);
    return newFreeTime.save();
  } catch (error) {
    console.log("Fail to store freeTime");
    return null;
  }
};

module.exports = {
  storeFreeTime,
};
