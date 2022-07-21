const { Achievement } = require("../models/Achievement");

const getAchievementByStudentId = async (student) => {
  try {
    const achievement = await Achievement.find({ student: student._id });
    return { achievement: achievement, student: student };
  } catch (error) {
    console.log(`fail to get achievement of student ${student._id}`);
    return null;
  }
};

const storeNewAchievement = async (data) => {
  try {
    const newAchievement = await new Achievement(data);
    newAchievement.save();
    return newAchievement;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateAchievement = async (data) => {
  try {
    const lessonId = data.lessonId;
    const commentData = data.commentData;
    Promise.all(
      commentData.map(async (item) => {
        var achievement = await Achievement.findOne({
          student: item.studentId,
          lesson: lessonId,
        });
        if (achievement) {
          achievement.comment = item.comment;
          achievement.save();
        } else {
          var newAchievement = await new Achievement({
            student: item.studentId,
            lesson: lessonId,
            comment: item.comment,
          });
          newAchievement.save();
        }
      })
    );
    return true;
  } catch (error) {
    console.log(`fail to update achievement`);
    return null;
  }
};

const getAchievementByAllStudentsAndMonth = async (
  month,
  currentPoint,
  compareType
) => {
  const currentMonth = (new Date(month).getMonth() % 12) + 1;
  const aggOptions = [
    {
      $lookup: {
        from: "lessons",
        localField: "lesson",
        foreignField: "_id",
        as: "lesson",
      },
    },
    {
      $unwind: {
        path: "$lesson",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "schedules",
        localField: "lesson.schedule",
        foreignField: "_id",
        as: "schedule",
      },
    },
    {
      $unwind: {
        path: "$schedule",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        student: 1,
        month: {
          $month: { $dateFromString: { dateString: "$schedule.time.date" } },
        },
        point: 1,
      },
    },
    {
      $match: {
        month: { $eq: currentMonth },
      },
    },
    {
      $group: {
        _id: "$student",
        averagePoint: { $avg: "$point" },
      },
    },
    {
      $match: {
        averagePoint: { $gte: currentPoint },
      },
    },
  ];
  const documents = await Achievement.aggregate(aggOptions);
  return documents.map(item => item._id);
};

module.exports = {
  getAchievementByStudentId,
  updateAchievement,
  storeNewAchievement,
  getAchievementByAllStudentsAndMonth,
};
