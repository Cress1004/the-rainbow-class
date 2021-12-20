import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button } from "antd";
import Axios from "axios";
import "./student.scss";
import { Link } from "react-router-dom";
import { transformStudentTypes } from "../../../../common/transformData";

function StudentList(props) {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [studentsNumber, setStudentsNumber] = useState(0);

  useEffect(() => {
    Axios.post("/api/students/get-students", null).then((response) => {
      if (response.data.success) {
        const data = response.data.students;
        setStudents(data);
        setStudentsNumber(data.length);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t]);

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "userName",
      render: (text, key) => renderData(text, key),
      width: 130,
    },
    {
      title: t("class_name"),
      dataIndex: "className",
      key: "className",
      width: 145,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("student_types"),
      dataIndex: "studentTypes",
      key: "studentTtypes",
      width: 175,
      render: (text, key) => renderData(text, key),
    },
  ];

  const data = students.map((item, index) => ({
    key: index,
    id: item._id,
    userName: item.user.name,
    className: item.class ? item.class_name : t('unset'),
    phoneNumber: item.phone_number,
    studentTypes: transformStudentTypes(item.student_types)
  }));

  const renderData = (text, key) => (
    <Link to={`students/${key.id}`} className={'text-in-table-row'}>
      <span>{text}</span>
    </Link>
  );

  return (
    <div className="student-list">
      <div className="student-list__title">
        {t("student_list")} ({`${studentsNumber} ${t("student")}`})
      </div>
      <Button type="primary" className="add-student-button">
        <Link to="/add-student">{t("add_student")}</Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default StudentList;
