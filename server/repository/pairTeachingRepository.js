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
      .sort({ volunteer: null });
    return pairs;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  storeNewPairTeachingWithStudent,
  getPairTeachingByClass,
};
