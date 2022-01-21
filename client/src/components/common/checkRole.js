import { ADMIN, STUDENT, SUPER_ADMIN, VOLUNTEER } from "./constant";

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
  if (userData?.subRole === ADMIN) return true;
  else return userData.userClassId === classId;
}
