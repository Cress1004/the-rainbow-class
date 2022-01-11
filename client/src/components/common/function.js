import { CALENDAR_COLOR_EVENT } from "./constant";

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
