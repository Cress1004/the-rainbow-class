module.exports = {
  STUDENT_ROLE: 0,
  VOLUNTEER_ROLE: 1,
  SUB_CLASS_MONITOR: 2,
  CLASS_MONITOR: 3,
  SUPER_ADMIN: 4,
  DEFAULT_IMAGE_PATH: "http://localhost:5000/images/",
  DEFAULT_AVATAR_PATH: "http://localhost:5000/avatars/",
  DEFAULT_CV_PATH: "http://localhost:5000/cv/",
  CV_FOLDER_PATH: "server/uploads/cv",
  AVATAR_FOLDER_PATH: "server/uploads/avatars",
  WEEKDAY: [
    { key: 0, value: "all", text: "all" },
    { key: 1, value: "Sun", text: "Chủ Nhật" },
    { key: 2, value: "Mon", text: "Thứ Hai" },
    { key: 3, value: "Tue", text: "Thứ Ba" },
    { key: 4, value: "Wed", text: "Thứ Tư" },
    { key: 5, value: "Thu", text: "Thứ Năm" },
    { key: 6, value: "Fri", text: "Thứ Sáu" },
    { key: 7, value: "Sat", text: "Thứ Bảy" },
  ],
  NOON_TIME : [
    {
      key: 0,
      value: "morning",
      text: "Sáng",
      startTime: "8:00",
      endTime: "11:00",
    },
    {
      key: 1,
      value: "afternoon",
      text: "Chiều",
      startTime: "13:00",
      endTime: "16:00",
    },
    {
      key: 2,
      value: "evening",
      text: "Tối",
      startTime: "19:00",
      endTime: "22:00",
    },
  ]
};

