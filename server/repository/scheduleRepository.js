const { compareObjectId } = require("../function/commonFunction");
const { Schedule } = require("../models/Schedule");
const { storeAddress, updateAddress } = require("./commonRepository");
const { createNewNoti } = require("./notificationRepository");
const { getPairById } = require("./pairTeachingRepository");

const storeInterviewSchedule = async (data) => {
  try {
    const newSchedule = new Schedule(data);
    // for (let index = 0; index < data.participants?.length; index++) {
    //   await createNewNoti({
    //     userId: data.participants[index],
    //     type: data.scheduleType === 0 ? 1 : 2, //1: lessson, 2: interview
    //   });
    // }
    return newSchedule.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateInterviewSchedule = async (cv, interviewTime, participants, linkOnline) => {
  try {
    const schedule = await Schedule.findOne({ _id: cv.schedule });
    schedule.time = interviewTime;
    schedule.participants = participants;
    schedule.linkOnline = linkOnline;
    schedule.save();
  } catch (error) {}
};

const storeNewSchedule = async (data, pairId) => {
  try {
    const address = await storeAddress(data.address);
    const pairTeaching = await getPairById(pairId);
    const newSchedule = await new Schedule(data);
    if (pairId) {
      newSchedule.personInCharge = pairTeaching.volunteer.user._id;
      newSchedule.participants = [pairTeaching.volunteer.user._id];
    }
    newSchedule.address = address._id;
    newSchedule.save();
    return newSchedule;
  } catch (error) {
    console.log(error);
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
    if (data.address) {
      if (schedule.address) {
        await updateAddress(schedule.address, data.address);
      } else {
        const address = await storeAddress({
          address: data.address.address,
          description: data.address.description,
        });
        schedule.address = address._id;
      }
    }
    schedule.teachOption = data.teachOption;
    schedule.linkOnline = data.linkOnline;
    schedule.time = data.time;
    return schedule.save();
  } catch (error) {
    console.log("fail to store Schedule");
  }
};

const addParticipant = async (scheduleId, userId) => {
  try {
    const schedule = await Schedule.findOne({ _id: scheduleId });
    schedule.participants.push(userId);
    await schedule.save();
  } catch (error) {
    console.log(error);
  }
};

const removeParticipant = async (scheduleId, currentUserId) => {
  try {
    const schedule = await Schedule.findOne({ _id: scheduleId });
    Promise.all(
      schedule.participants.filter(
        (userId) => !compareObjectId(userId, currentUserId)
      )
    ).then((result) => {
      schedule.participants = result;
      schedule.save();
    });
  } catch (error) {
    console.log("fail to remove participant");
  }
};

const getAllSchedulesByVolunteer = async (data) => {
  try {
    return await Schedule.find({ participants: data });
  } catch (error) {
    console.log("fail to get user schedule");
  }
};

const updatePersonInCharge = async (scheduleId, personInChargeId) => {
  try {
    const schedule = await Schedule.findOne({ _id: scheduleId });
    schedule.personInCharge = personInChargeId;
    return schedule.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  storeNewSchedule,
  deleteSchedule,
  updateSchedule,
  addParticipant,
  removeParticipant,
  getAllSchedulesByVolunteer,
  updatePersonInCharge,
  storeInterviewSchedule,
  updateInterviewSchedule,
};
