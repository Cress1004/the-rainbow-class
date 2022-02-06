import {
  ADMIN,
  CALENDAR_COLOR_EVENT,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
} from "./constant";

export function generateKey() {
  return new Date().getTime();
}

export function setColorForClass(classes) {
  if (!classes.length) return {};
  return classes.map((item, index) => ({
    classId: item._id,
    color:
      CALENDAR_COLOR_EVENT[
        index > CALENDAR_COLOR_EVENT.length
          ? index - CALENDAR_COLOR_EVENT.length
          : index
      ],
  }));
}

export function checkAdminAndMonitorRole(userRole) {
  return (
    userRole &&
    (userRole.subRole === ADMIN ||
      userRole.subRole === CLASS_MONITOR ||
      userRole.subRole === SUB_CLASS_MONITOR)
  );
}

export function checkStudentAndCurrentUserSameClass(student, currentUserData) {
  const userRole = currentUserData.userRole;
  if (userRole.subRole === SUPER_ADMIN) return false;
  else if (userRole.subRole === ADMIN) return true;
  else return student.classId === currentUserData.userClassId;
}
