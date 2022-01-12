import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "../schedule.scss";
import MyCalendar from "../Sessions/Calendar";

function ClassSchedule(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [schedule, setSchedule] = useState([]);
  const [classData, setClassData] = useState();
  useEffect(() => {
    Axios.post(`/api/classes/my-class-schedules`, { userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.schedule;
          
          setSchedule(data);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, userId]);

  return (
    <div className="class-schedule">
      <div className="class-schedule__title">{t("class_schedule")} - </div>
      <MyCalendar data={schedule}/>
    </div>
  );
}

export default ClassSchedule;
