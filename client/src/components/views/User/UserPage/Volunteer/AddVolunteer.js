import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Select, Button, Radio } from "antd";
import Axios from "axios";
import "./volunteer.scss";

//const { Option } = Select;

function AddVolunteer(props) {
  const { t } = useTranslation();
  const [role, setRole] = useState(0);
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };
  const variable = { useForm: localStorage.getItem("userId") };
  const [location, setLocation] = useState([]);

  useEffect(() => {
    Axios.post("/api/common-data/location", variable)
      .then((response) => {
        if (response.data.success) {
          setLocation(response.data.location);
        } else {
          alert("Fail");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleChangeRole = (e) => {
    setRole(e.target.value);
  };

  console.log(location);

  //   const onGenderChange = (value: string) => {
  //     switch (value) {
  //       case "male":
  //         form.setFieldsValue({ note: "Hi, man!" });
  //         return;
  //       case "female":
  //         form.setFieldsValue({ note: "Hi, lady!" });
  //         return;
  //       case "other":
  //         form.setFieldsValue({ note: "Hi there!" });
  //     }
  //   };

  return (
    <div className="add-volunteer">
      <div className="add-volunter__title">{t("add-volunteer")}</div>
      <Form {...layout} name="control-hooks">
        <Form.Item
          name="name"
          label={t("user_name")}
          rules={[{ required: true, validateMessages: t("required_name") }]}
        >
          <Input placeholder={t("input_name")} />
        </Form.Item>
        <Form.Item
          name="email"
          label={t("email")}
          rules={[{ required: true, validateMessages: t("required_email") }]}
        >
          <Input placeholder={t("input_email")} />
        </Form.Item>
        <Form.Item name="phone_number" label={t("phone_number")}>
          <Input placeholder={t("input_phone_number")} />
        </Form.Item>
        <Form.Item name="address" label={t("address")}>
          <Input placeholder={t("input_")} />
          <Input placeholder={t("input_stress_no")} />
          <Input placeholder={t("input_stress_no")} />
          <Input placeholder={t("input_stress_no")} />
        </Form.Item>
        <Form.Item name="class" label={t("class")}>
          <Input placeholder={t("input_class")} />
        </Form.Item>
        <Form.Item name="role" label={t("role")}>
          <Radio.Group onChange={handleChangeRole} value={role}>
            <Radio value={0}>{t("volunteer")}</Radio>
            <Radio value={1}>{t("class_monitor")}</Radio>
            <Radio value={2}>{t("sub_class_monitor")}</Radio>
          </Radio.Group>
        </Form.Item>

        {/* <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select
            placeholder="Select a option and change input text above"
            //onChange={onGenderChange}
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.gender !== currentValues.gender
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("gender") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddVolunteer;
