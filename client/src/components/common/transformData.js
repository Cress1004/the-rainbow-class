import moment from "moment";
import { WEEKDAY, formatTimeSchedule } from "./constant";

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
  return time ? moment(new Date(time), formatTimeSchedule) : undefined;
}

export function transformDefaultSchedule(data) {
  return data
    ? {
        key: data.key,
        dayOfWeek: WEEKDAY.find((item) => item.key === data.dayOfWeek).text,
        endTime: moment(new Date(data.endTime)).format(formatTimeSchedule),
        startTime: moment(new Date(data.startTime)).format(formatTimeSchedule),
      }
    : undefined;
}
