const { PairTeaching } = require("../models/PairTeaching");

const storeNewPairTeachingWithStudent = async (studentId, classId) => {
  try {
    const newPair = await new PairTeaching({
      student: studentId,
      class: classId,
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
      .sort({volunteer: null});
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
