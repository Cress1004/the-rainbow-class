import React from "react";
import { Table, Tooltip } from "antd";
import "./class-list.scss";
function ClassList(props) {
  const numberOfClass = 10;
  const t = (string) => {
    return string;
  };
  const columns = [
    {
      title: t("Tên lớp"),
      dataIndex: "className",
      key: "className",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <span>{text}</span>,
      width: 100,
    },
    {
      title: t("Địa chỉ"),
      dataIndex: "address",
      key: "address",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => <span>{address}</span>,
    },
    {
      title: t("Lớp trưởng"),
      dataIndex: "classMonitor",
      key: "classMonitor",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (classMonitor) => <span>{classMonitor}</span>,
    },
    {
      title: t("Đối tượng"),
      dataIndex: "targetStudent",
      key: "targetStudent",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (targetStudent) => <span>{targetStudent}</span>,
    },
    {
      title: t("Sĩ số"),
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
        {t("Danh sách các lớp học")} ({`${numberOfClass} lớp`})
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default ClassList;
