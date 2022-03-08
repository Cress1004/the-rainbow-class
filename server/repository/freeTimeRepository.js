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

const getFreeTimeByCVId = async (cvId) => {
  try {
    return await FreeTime.find({ cv: cvId }).select("weekDay noon");
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  storeFreeTime,
  getFreeTimeByCVId,
};
