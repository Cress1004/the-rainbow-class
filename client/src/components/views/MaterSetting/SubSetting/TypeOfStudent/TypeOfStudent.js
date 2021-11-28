import { Button, Table, Form, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";

function TypeOfStudent() {
  const { t } = useTranslation();
  const key = "updatable";
  const variable = { useForm: localStorage.getItem("userId") };

  const [studentTypes, setStudentTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [add, setAdd] = useState(false);

  useEffect(() => {
    Axios.post("/api/common-data/student-types", variable).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  const columns = [
    {
      title: t("student-type"),
      dataIndex: "studentType",
      key: "studentType",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("action"),
      key: "action",
      dataIndex: "action",
      render: (record) => (
        <button onClick={() => console.log(record)}>{"Button Text"}</button>
      ),
    },
  ];

  const data = studentTypes.map((item, index) => ({
    key: index,
    studentType: item.title,
  }));

  const handleClickAdd = () => {
    setAdd(true);
  };

  const handleClickBack = () => {
    setAdd(false);
  };

  const handleSubmit = async (e) => {
    const type = { title: newType };
    try {
      const response = await Axios.post(
        "/api/common-data/add-student-type",
        type
      );
      if (response.data.success) openMessage();
    } catch (error) {
      alert(t("fail-to-send-data"));
    }
  };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

    // const validateMessages = {
    //   required: t("require_student_type"),
    // };

  return (
    <div>
      <div className="type-of-student-list__title">
        {t("type-of-student-list")}
      </div>
      {add ? (
        <div>
          <Button onClick={handleClickBack}>{t("back")}</Button>
          <Form
            onSubmit={handleSubmit}
            // validateMessages={validateMessages}
          >
            <Form.Item label={t("student-type")} rules={[{ required: true, validateMessages: t("required-student-type")}]}>
              <Input onChange={(e) => setNewType(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={openMessage}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div>
          <Button onClick={handleClickAdd}>{t("add-new-student-type")}</Button>
          <Table columns={columns} dataSource={data} />
        </div>
      )}
    </div>
  );
}

export default TypeOfStudent;
