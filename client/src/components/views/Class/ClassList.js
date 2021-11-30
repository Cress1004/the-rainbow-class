import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table } from "antd";
import "./class-list.scss";
import { Link } from "react-router-dom";
import Axios from "axios";
import {transformAddressData, transformStudentTypes} from "../../common/transformData";

function ClassList(props) {
  const { t } = useTranslation();
  const variable = { useForm: localStorage.getItem("userId") };
  const [classes, setClasses] = useState();

  useEffect(() => {
    Axios.post("/api/classes/get-classes", variable).then((response) => {
      if (response.data.success) {
        setClasses(response.data.classes);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  const data = classes
    ? classes.map((item, index) => ({
        key: index,
        className: item.class_name,
        description: item.description,
        address: transformAddressData(item.address),
        classMonitor: item.class_monitor
          ? item.class_monitor
          : `(${t("unset")})`,
        targetStudent: transformStudentTypes(item.student_types),
        numberOfStudent: item.students.length,
      }))
    : [];

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

  return (
    <div className="class-list">
      <div className="class-list__title">
        {t("class_list")} ({`${data.length} ${t("class")}`})
      </div>
      <Button type="primary" className="add-class-button">
        <Link to="/add-class">{t("add_class")}</Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default ClassList;
