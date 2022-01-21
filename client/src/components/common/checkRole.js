import {
  ADMIN,
  CLASS_MONITOR,
  STUDENT,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
  VOLUNTEER,
} from "./constant";

export function checkAdminRole(userRole) {
  return userRole?.subRole === ADMIN;
}

export function checkAdminAndVolunteerRole(userRole) {
  if (userRole.role === VOLUNTEER) {
    return userRole.subRole === SUPER_ADMIN ? false : true;
  } else {
    return false;
  }
}

export function checkCurrentUserBelongToCurrentClass(userData, classId) {
  if (userData?.userRole.subRole === ADMIN) return true;
  else return userData.userClassId === classId;
}

export function checkCurrentMonitorBelongToCurrentClass(userData, classId) {
  const userRole = userData?.userRole;
  if (userRole.subRole === ADMIN) return true;
  else if (
    userRole.subRole === SUB_CLASS_MONITOR ||
    userRole === CLASS_MONITOR
  ) {
    return userData.userClassId === classId;
  } else return false;
}
