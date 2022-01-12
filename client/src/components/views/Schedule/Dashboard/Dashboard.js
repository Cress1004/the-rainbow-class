import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "../schedule.scss";
import MyCalendar from "../Sessions/Calendar";

function Dashboard(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    Axios.post(`/api/users/my-schedule`, { userId: userId }).then(
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
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
      <MyCalendar data={schedule}/>
    </div>
  );
}

export default Dashboard;
