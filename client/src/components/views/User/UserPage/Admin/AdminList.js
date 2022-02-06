import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button } from "antd";
import Axios from "axios";
// import "./student.scss";
import { Link } from "react-router-dom";
import useFetchRole from "../../../../../hook/useFetchRole";
import { SUPER_ADMIN } from "../../../../common/constant";
import { checkAdminAndMonitorRole } from "../../../../common/function";

function AdminList(props) {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const userId = localStorage.getItem("userId");
  const userData = useFetchRole(userId);
  const userRole = userData.userRole;
  useEffect(() => {
    Axios.post("/api/admin/get-admin", null).then((response) => {
      const result = response.data;
      if (result.success) {
        setAdmins(result.admin);
      } else if (!result.success) {
        alert(result.message);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
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
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 175,
      render: (text, key) => renderData(text, key),
    },
  ];

  const data = admins.map((item, index) => ({
    key: index,
    id: item._id,
    userName: item.user.name,
    phoneNumber: item.user.phoneNumber,
    email: item.user.email,
  }));

  const renderData = (text) => (
    <span className="text-in-table-row">{text}</span>
  );

  return (
    <div className="student-list">
      <div>
        <div className="student-list__title">
          {t("admin")} ({`${admins?.length}`})
        </div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}

export default AdminList;
