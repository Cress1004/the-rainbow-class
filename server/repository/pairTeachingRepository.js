const { PairTeaching } = require("../models/PairTeaching");
const { storeAddress } = require("./commonRepository");

const registerPairTeachingWithStudent = async (data) => {
  try {
    const address = await storeAddress(data.address);
    const pair = await PairTeaching.findOne({ student: data.student });

    pair.address = address._id;
    pair.teachOption = data.teachOption;
    pair.subjects = data.subjects;
    pair.grade = data.grade;
    pair.numberOfLessonsPerWeek = data.numberOfLessonsPerWeek;
    pair.status = 1;

    return pair.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

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

const getPairTeachingByClass = async (classId) => {
  try {
    const pairs = await PairTeaching.find({ class: classId })
      .populate({
        path: "student",
        find: { retirementDate: { $exists: false } },
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
      .sort({ updated_at: -1 });
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

const getPairByVolunteerId = async (volunteerId) => {
  try {
    const pair = await PairTeaching.findOne({ volunteer: volunteerId })
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
      .populate({ path: "address" })
      .sort({ volunteer: null });
    return pair;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getPairById = async (pairId) => {
  try {
    const pair = await PairTeaching.findOne({ _id: pairId })
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
      .populate({ path: "address" })
      .sort({ volunteer: null });
    return pair;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getAllPairs = async () => {
  try {
    const pairs = await PairTeaching.find({});
    return pairs;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  storeNewPairTeachingWithStudent,
  getPairTeachingByClass,
  setVolunteer,
  registerPairTeachingWithStudent,
  getPairByVolunteerId,
  getPairById,
  getAllPairs,
};
