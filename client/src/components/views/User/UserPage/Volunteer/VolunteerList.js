import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button } from "antd";
import Axios from "axios";
import "./volunteer.scss";
import { Link } from "react-router-dom";

const CLASS_MONITOR = 1;
const SUB_CLASS_MONITOR = 2;

function VolunteerList(props) {
  const { t } = useTranslation();
  const [volunteers, setVolunteers] = useState([]);
  const [volunteersNumber, setVolunteersNumber] = useState(0);

  useEffect(() => {
    Axios.post("/api/volunteers/get-volunteers", null).then((response) => {
      if (response.data.success) {
        const data = response.data.volunteers;
        setVolunteers(data);
        setVolunteersNumber(data.length);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  console.log(volunteers);

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
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 175,
      render: (text, key) => renderData(text, key),
    },
  ];

  const transformRoleName = (name, role) => {
    if (role === CLASS_MONITOR) {
      return `${name} (${t("short_class_monitor")})`;
    }
    if (role === SUB_CLASS_MONITOR) {
      return `${name} (${t('short_sub_class_monitor')})`;
    }
    else return name;
  };

  const data = volunteers.map((item, index) => ({
    key: index,
    id: item._id,
    userName: transformRoleName(item.user.name, item.role),
    className: item.class.class_name,
    phoneNumber: item.phone_number,
    role: item.role,
    email: item.user.email,
  }));

  const renderData = (text, key) => (
    <Link to={`volunteers/${key.id}`} className={'text-in-table-row'}>
      <span>{text}</span>
    </Link>
  );

  return (
    <div className="volunteer-list">
      <div className="volunteer-list__title">
        {t("volunteer_list")} ({`${volunteersNumber} ${t("volunteer")}`})
      </div>
      <Button type="primary" className="add-volunteer-button">
        <Link to="/add-volunteer">{t("add_volunteer")}</Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default VolunteerList;
