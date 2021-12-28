import moment from "moment";
import { WEEKDAY, FORMAT_TIME_SCHEDULE, FORMAT_DATE } from "./constant";

export function transformAddressData(data) {
  return data && data.address && data.description
    ? `${data.description}, ${data.address.ward.name}, ${data.address.district.name}, ${data.address.province.name}`
    : "";
}

export function transformStudentTypes(data) {
  return data ? data.map((item) => item.title).join(", ") : "";
}

export function getArrayLength(data) {
  return data ? data.length : 0;
}

export function transformStudentTypesToArray(data) {
  return data ? data.map((item) => item.title) : [];
}

export function transformScheduleTime(time) {
  return time ? moment(new Date(time), FORMAT_TIME_SCHEDULE) : undefined;
}

export function transformSchedule(data) {
  return data
    ? {
        key: data.key,
        dayOfWeek: WEEKDAY.find((item) => item.key === data.dayOfWeek).text,
        endTime: moment(new Date(data.endTime)).format(FORMAT_TIME_SCHEDULE),
        startTime: moment(new Date(data.startTime)).format(FORMAT_TIME_SCHEDULE),
      }
    : undefined;
}

export function transformLessonTime(data) {
  return data
  ? {
      key: data.key,
      dayOfWeek: WEEKDAY.find((item) => item.key === data.dayOfWeek).text,
      endTime: moment(new Date(data.endTime)).format(FORMAT_TIME_SCHEDULE),
      startTime: moment(new Date(data.startTime)).format(FORMAT_TIME_SCHEDULE),
      date: moment(new Date(data.endTime)).format(FORMAT_DATE),
    }
  : undefined;
}

export function transformLessonTimeToString(data) {
  const newData = transformLessonTime(data)
  console.log(newData);
  return newData
  ? `${newData.date} ${newData.startTime} - ${newData.endTime}`
  : "";
}
