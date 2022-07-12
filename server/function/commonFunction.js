var moment = require('moment');

const compareObjectId = (id1, id2) => {
  return id1?.toString() === id2?.toString();
};

const randomUnixSuffix = () => {
  return Date.now() + "-" + Math.round(Math.random() * 1e9);
};

const checkCurrentUserBelongToCurrentClass = (
  currentUser,
  currentVolunteer,
  currentClass
) => {
  if (currentVolunteer.isAdmin) return true;
  else return compareObjectId(currentUser.class, currentClass._id);
};

const transformScheduleTimeData = (time) => {
  if (time) return `${moment(new Date(time.date)).format('YYYY/MM/DD')} ${time.startTime} - ${time.endTime}`;
  else return null;
}

const checkRetirement = (dateString) => {
  const retirementDate = new Date(dateString);
  const currentDate = new Date();
  return retirementDate <= currentDate;
}

module.exports = {
  compareObjectId,
  randomUnixSuffix,
  checkCurrentUserBelongToCurrentClass,
  transformScheduleTimeData,
  checkRetirement
};
