import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Select, Button } from "antd";
import Axios from "axios";
import "./volunteer.scss";

const { Option } = Select;

function AddVolunteer(props) {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [volunteerData, setVolunteerData] = useState({});
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  useEffect(() => {
    Axios.post("/api/classes/get-classes", null).then((response) => {
      if (response.data.success) {
        setClasses(response.data.classes);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/api/volunteers/add-volunteer", volunteerData);
      if (response.data.success) {
        alert("success");
      }
    } catch (error) {
      alert(t("fail-to-send-data"));
    }
  };

  return (
    <div className="add-volunteer">
      <div className="add-volunteer__title">{t("add_volunteer")}</div>
      <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
        <Form.Item
          name="name"
          label={t("user_name")}
          rules={[{ required: true, validateMessages: t("required_name") }]}
        >
          <Input
            placeholder={t("input_name")}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, name: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          name="email"
          label={t("email")}
          rules={[{ required: true, validateMessages: t("required_email") }]}
        >
          <Input
            placeholder={t("input_email")}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, email: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item name="phone_number" label={t("phone_number")}>
          <Input
            placeholder={t("input_phone_number")}
            onChange={(e) =>
              setVolunteerData({
                ...volunteerData,
                phone_number: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item name="classes" label={t("class")}>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("input_class")}
            onChange={(value) =>
              setVolunteerData({ ...volunteerData, class: value })
            }
          >
            {classes.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.class_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddVolunteer;
