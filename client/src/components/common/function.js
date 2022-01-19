import {
  ADMIN,
  CALENDAR_COLOR_EVENT,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} from "./constant";

export function generateKey() {
  return new Date().getTime();
}

export function setColorForClass(classes) {
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
