import React from "react";
import { useTranslation } from "react-i18next";
import { Table, Button } from "antd";
import "./volunteer.scss";
import { Link } from "react-router-dom";
function VolunteerList(props) {
  const numberOfVolunteers = 10;
  const { t } = useTranslation();
  const findIndex = (data, key) => {
    return data.find(item => item.key = key);
  } 
  const columns = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "userName",
      ellipsis: {
        showTitle: false,
      },
      render: (text, key) => 
        <span>{text} {findIndex(data, key).role === 1 ? "LT" : ""}</span>,
      width: 150,
    },
    {
      title: t("class_name"),
      dataIndex: "className",
      key: "className",
      width: 125,
      ellipsis: {
        showTitle: false,
      },
      render: (className) => <span>{className}</span>,
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (phoneNumber) => <span>{phoneNumber}</span>,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 175,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => <span>{email}</span>,
    },
  ];

  const data = [
    {
      key: "1",
      userName: "Nguyễn Thị Hải Thanh",
      className: "Lớp học Ong Mật",
      phoneNumber: "0382195410",
      email: "nuhoangchenhac@gmail.com",
      role: 0,
    },
    {
      key: "2",
      userName: "Nguyễn Thị Hải Thanh",
      className: "Lớp học Ong Mật",
      phoneNumber: "0382195410",
      email: "nuhoangchenhac@gmail.com",
      role: 1,
    },
    {
      key: "3",
      userName: "Nguyễn Thị Hải Thanh",
      className: "Lớp học Ong Mật",
      phoneNumber: "0382195410",
      email: "nuhoangchenhac@gmail.com",
      role: 0,
    },
    {
      key: "4",
      userName: "Nguyễn Thị Hải Thanh",
      className: "Lớp học Ong Mật",
      phoneNumber: "0382195410",
      email: "nuhoangchenhac@gmail.com",
      role: 1,
    },
  ];

  return (
    <div className="volunteer-list">
      <div className="volunteer-list__title">
        {t("volunteer_list")} ({`${numberOfVolunteers} ${t("volunteer")}`})
      </div>
      <Button type="primary" className="add-volunteer-button"><Link to="/add-volunteer">{t("add_volunteer")}</Link></Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default VolunteerList;
