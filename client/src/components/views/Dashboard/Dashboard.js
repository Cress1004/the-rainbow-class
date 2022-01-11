import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "./dashboard.scss";
import {
  convertDateStringToMoment,
} from "../../common/transformData";
import MyCalendar from "./Calendar";

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
  function getListData(value) {
    let listData = schedule.filter(
      (item) =>
        convertDateStringToMoment(item.time.date).date() === value.date() &&
        convertDateStringToMoment(item.time.date).month() === value.month() &&
        convertDateStringToMoment(item.time.date).year() === value.year()
    );
    return listData || [];
  }
  const dateRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={item._id}>
            {/* <Badge status="warning" text={`Lesson`} /> */}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
      <MyCalendar data={schedule}/>
    </div>
  );
}

export default Dashboard;
