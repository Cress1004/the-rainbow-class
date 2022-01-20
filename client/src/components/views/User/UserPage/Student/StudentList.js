import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button } from "antd";
import Axios from "axios";
import "./student.scss";
import { Link } from "react-router-dom";
import { transformStudentTypes } from "../../../../common/transformData";
import useFetchRole from "../../../../../hook/useFetchRole";
import { SUPER_ADMIN } from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";

function StudentList(props) {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const userId = localStorage.getItem("userId");
  const userData = useFetchRole(userId);
  const userRole = userData.userRole;
  useEffect(() => {
    Axios.post("/api/students/get-students", { userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.students;
          setStudents(data);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, userId]);

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
    className: item.class ? item.class.name : t("unset"),
    phoneNumber: item.user.phoneNumber,
    studentTypes: transformStudentTypes(item.studentTypes),
  }));

  const renderData = (text, key) => (
    <Link to={`/students/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );

  if (userRole && userRole.subRole === SUPER_ADMIN) {
    return <PermissionDenied />;
  }

  return (
    <div className="student-list">
      {userRole && userRole.subRole !== SUPER_ADMIN && (
        <div>
          <div className="student-list__title">
            {t("student_list")} ({`${students?.length} ${t("student")}`})
          </div>
          {checkAdminAndMonitorRole(userRole) && (
            <Button type="primary" className="add-student-button">
              <Link to="/add-student">{t("add_student")}</Link>
            </Button>
          )}
          <Table columns={columns} dataSource={data} />
        </div>
      )}
    </div>
  );
}

export default StudentList;
