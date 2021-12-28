import React, { useState } from "react";
import { Button, Table, Row } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  transformAddressData,
  transformLessonTimeToString,
} from "../../../common/transformData";
import { OFFLINE_OPTION } from "../../../common/constant";

function LessonList(props) {
  const { t } = useTranslation();
  const { id, lessons } = props;

  const data = lessons
    ? lessons.map((item, index) => ({
        key: index,
        id: item._id,
        title: item.title,
        description: item.description,
        // address: transformAddressData(item.schedule.address),
        teachOption: item.schedule.teachOption,
        time: transformLessonTimeToString(item.schedule.time),
        // classMonitor: item.class_monitor
        //   ? item.class_monitor
        //   : `(${t("unset")})`,
        // targetStudent: transformStudentTypes(item.studentTypes),
        // numberOfStudent: item.students.length,
      }))
    : [];

  const columns = [
    {
      title: t("lesson_name"),
      dataIndex: "title",
      key: "title",
      render: (text, key) => renderData(text, key),
      width: 100,
    },
    {
      title: t("person_in_charge"),
      dataIndex: "personInCharge",
      key: "personInCharge",
      width: 120,
      render: (text, key) => renderData(text ? text : t("un_register"), key),
    },
    {
      title: t("time"),
      dataIndex: "time",
      key: "time",
      width: 150,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("teach_option"),
      dataIndex: "teachOption",
      key: "teachOption",
      width: 75,
      render: (text, key) =>
        renderData(
          text === OFFLINE_OPTION ? t("offline_option") : t("online_option"),
          key
        ),
    },
  ];

  const renderData = (text, key) => (
    <Link
      to={`${id}/lessons/${key.id}`}
      className={"text-in-table-row"}
    >
      <span>{text}</span>
    </Link>
  );
  return (
    <div className="lesson-list">
      <Row>
        <div className="lesson-list__title">
          {t("lesson_list")} ({`${data.length} ${t("class")}`})
        </div>
        <div className="lesson-list__add-lesson">
          <Button type="primary">
            <Link to={`/classes/${id}/lessons/add`}>{t("add_lesson")}</Link>
          </Button>
        </div>
      </Row>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default LessonList;
