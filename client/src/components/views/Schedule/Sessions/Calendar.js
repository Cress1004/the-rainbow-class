import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { setColorForClass } from "../../../common/function";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import {
  transformEventOfLesson,
  transformLessonTimeToString,
} from "../../../common/transformData";

const localizer = momentLocalizer(moment);
function MyCalendar(props) {
  const { t } = useTranslation();
  const { data } = props;
  const events = data.map((item) => transformEventOfLesson(item));
  const [classColors, setClassColors] = useState([]);

  useEffect(() => {
    Axios.post(`/api/classes/get-classes/`, null).then((response) => {
      if (response.data.success) {
        const data = response.data.classes;
        const colors = setColorForClass(data);
        setClassColors(colors);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  const content = (event) => (
    <>
      <p>
        {t("lesson_name")}: {event.lessonTitle}
      </p>
      <p>
        {t("time")}: {transformLessonTimeToString(event.time)}
      </p>
      <p>
        {t("person_in_charge")}: {event.personInCharge}
      </p>
      <Link
        to={`/classes/${event.classId}/lessons/${event.lessonId}`}
        className="show-lesson-detail"
      >
        {t("detail")}
      </Link>
    </>
  );

  const EventComponent = ({ event }) => (
    <Popover
      title={event.title}
      trigger="click"
      placement="topLeft"
      content={content(event)}
    >
      {event.title}
    </Popover>
  );

  return (
    <div>
      {events && classColors.length && (
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          events={events}
          eventPropGetter={(event) => {
            const classId = event.classId;
            return {
              style: {
                backgroundColor: classColors.find(
                  (item) => item.classId === classId
                ).color,
              },
            };
          }}
          popup={true}
          components={{
            event: EventComponent,
          }}
        />
      )}
    </div>
  );
}

export default MyCalendar;
