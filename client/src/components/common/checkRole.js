import { ADMIN } from "./constant";

export function checkAdminRole(userData) {
  return userData.userRole.subRole === ADMIN;
}
