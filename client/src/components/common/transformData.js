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
      date: moment(new Date(data.date)).format(FORMAT_DATE),
    }
  : undefined;
}

export function transformLessonTimeToString(data) {
  const newData = transformLessonTime(data)
  return newData
  ? `${newData.date} ${newData.startTime} - ${newData.endTime}`
  : "";
}

export function convertTimeStringToMoment(string) {
  return string
  ? moment(string, FORMAT_TIME_SCHEDULE)
  : undefined;
}

export function convertDateStringToMoment(string) {
  return string
  ? moment(string, FORMAT_DATE)
  : undefined;
}

export function transformEventOfLesson(data) {
  const time = data.schedule.time;
  const date = moment(new Date(time.date)).format(FORMAT_DATE).toString();
  const start = moment(new Date(time.startTime)).format(FORMAT_TIME_SCHEDULE).toString();
  const end = moment(new Date(time.endTime)).format(FORMAT_TIME_SCHEDULE).toString();
  return {
    title: data.class.name,
    lessonTitle: data.title,
    className: data.class.name,
    classId: data.class._id,
    lessonId: data._id,
    personInCharge: data.personInCharge ? data.personInCharge : "unset",
    time: time,
    start: new Date(`${date} ${start}`),
    end: new Date(`${date} ${end}`),
  }
}