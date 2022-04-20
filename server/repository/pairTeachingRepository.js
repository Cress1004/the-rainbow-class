const { PairTeaching } = require("../models/PairTeaching");
const { storeAddress } = require("./commonRepository");

const storeNewPairTeachingWithStudent = async (data) => {
  try {
    const address = await storeAddress(data.address);
    const newPair = await new PairTeaching({
      student: data.student,
      address: address._id,
      class: data.classId,
      teachOption: data.teachOption,
      subjects: data.subjects,
      grade: data.grade,
      numberOfLessonsPerWeek: data.numberOfLessonsPerWeek,
      status: 1,
    });
    return newPair.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getPairTeachingByClass = async (classData) => {
  try {
    const pairs = await PairTeaching.find({ class: classData._id })
      .populate({
        path: "student",
        select: "user",
        populate: { path: "user", select: "name" },
      })
      .populate({
        path: "volunteer",
        select: "user",
        populate: { path: "user", select: "name" },
      })
      .populate({
        path: "grade",
      })
      .populate({
        path: "subjects",
      })
      .sort({ volunteer: null });
    return pairs;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const setVolunteer = async (data) => {
  try {
    const pair = await PairTeaching.findOne({ _id: data.pairId });
    pair.volunteer = data.volunteer;
    pair.status = 2;
    return pair.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  storeNewPairTeachingWithStudent,
  getPairTeachingByClass,
  setVolunteer
};
