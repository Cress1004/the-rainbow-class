import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";

function PaticipantList(props) {
  const { t } = useTranslation();
  const { participants } = props;

  const data = participants
    ? participants.map((item, index) => ({
        key: index,
        id: item._id,
        name: item.name,
        phoneNumber: item.phoneNumber,
      }))
    : [];

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "name",
      key: "name",
      render: (text, key) => <span>{text}</span>,
      width: 100,
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, key) => <span>{text}</span>,
    },
  ];

  return (
    <div className="participant-list">
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default PaticipantList;
