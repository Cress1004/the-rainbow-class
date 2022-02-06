import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import Axios from "axios";
import "./admin.scss";

function AdminList(props) {
  const { t } = useTranslation();
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    Axios.post("/api/admin/get-admin", null).then((response) => {
      const result = response.data;
      if (result.success) {
        setAdmin(result.admin);
      } else if (!result.success) {
        alert(result.message);
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

  const data = admin.map((item, index) => ({
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
    <div className="admin-list">
      <div>
        <div className="admin-list__title">
          {t("admin")} ({`${admin?.length}`})
        </div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}

export default AdminList;
