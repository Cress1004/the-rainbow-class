import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import "./class-list.scss";
function ClassList(props) {
  const numberOfClass = 10;
  const { t } = useTranslation();
  const columns = [
    {
      title: t("class_name"),
      dataIndex: "className",
      key: "className",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <span>{text}</span>,
      width: 100,
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => <span>{address}</span>,
    },
    {
      title: t("class_monitor"),
      dataIndex: "classMonitor",
      key: "classMonitor",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (classMonitor) => <span>{classMonitor}</span>,
    },
    {
      title: t("target_student"),
      dataIndex: "targetStudent",
      key: "targetStudent",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (targetStudent) => <span>{targetStudent}</span>,
    },
    {
      title: t("number_of_student"),
      dataIndex: "numberOfStudent",
      key: "numberOfStudent",
      width: 50,
      ellipsis: {
        showTitle: false,
      },
      render: (numberOfStudent) => (
        <span style={{ textAlign: "center" }}>{numberOfStudent}</span>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      className: "Lớp Ong Mật",
      classMonitor: "Nguyễn Thị Hải Thanh",
      numberOfStudent: 32,
      address: "Số 4, ngách 24, ngõ Mai Hương, Bạch Mai, Hai Bà Trưng, Hà Nội",
      targetStudent: "Học sinh khuyết tật",
    },
    {
      key: "2",
      className: "Lớp Phúc Xá",
      classMonitor: "Jim Green",
      numberOfStudent: 42,
      address: "Phúc Xá, Hà Nội",
    },
    {
      key: "3",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "4",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "5",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "6",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "7",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "8",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "9",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
    {
      key: "10",
      className: "Lớp Rồng Xanh",
      classMonitor: "Joe Black",
      numberOfStudent: 32,
      address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    },
  ];

  return (
    <div className="class-list">
      <div className="class-list__title">
        {t("class_list")} ({`${numberOfClass} ${t("class")}`})
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default ClassList;
