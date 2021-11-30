import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { Form, Input, Select, Button, message } from "antd";

const { Option } = Select;
const { TextArea } = Input;

function AddClass(props) {
  const { t } = useTranslation();
  const key = "updatable";
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const variable = { useForm: localStorage.getItem("userId") };
  const [location, setLocation] = useState([]);
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState({});
  const [types, setTypes] = useState([]);

  const [studentTypes, setStudentTypes] = useState([]);
  useEffect(() => {
    Axios.post("/api/common-data/location", variable).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api"));
      }
    });

    Axios.post("/api/common-data/student-types", variable).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id); 
    setProvince({id: currentProvince.id, name: currentProvince.name});
    setDistricts(currentProvince.districts);
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({id: currentDistrict.id, name: currentDistrict.name});
    setWards(currentDistrict.wards);
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({id: currentWard.id, name: currentWard.name});
  };

  const handleChangeStudentType = (value) => {
    setTypes(value);
  };

  const handleSubmit = (e) => {
    const data = {
      class_name: className,
      description: description,
      address: address,
      student_types: types,
    };
    Axios.post("/api/classes/add-class", data).then((response) => {
      if (response.data.success) {
        openMessage();
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  return (
    <div className="add-class">
      <div className="add-class__title">{t("add_class")}</div>
      <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
        <Form.Item
          name="name"
          label={t("class_name")}
          rules={[
            { required: true, validateMessages: t("required_class_name") },
          ]}
        >
          <Input
            placeholder={t("input_class_name")}
            onChange={(e) => setClassName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("description")}
          rules={[
            { required: true, validateMessages: t("required_description") },
          ]}
        >
          <TextArea
            placeholder={t("input_description")}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="address" label={t("address")}>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              marginRight: "10px",
            }}
            placeholder={t("input_province")}
            onChange={handleChangeProvice}
          >
            {location.map((option) => (
              <Option key={option._id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              margin: "0px 10px",
            }}
            placeholder={t("input_district")}
            onChange={handleChangeDistrict}
          >
            {districts.length
              ? districts.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              marginLeft: "10px",
            }}
            placeholder={t("input_ward")}
            onChange={handleChangeWard}
          >
            {wards.length
              ? wards.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Input
            placeholder={t("input_specific_address")}
            onChange={(e) => {
              setAddress({
                address: {
                  province: province,
                  district: district,
                  ward: ward,
                },
                description: e.target.value,
              });
            }}
          />
        </Form.Item>
        <Form.Item name="studentType" label={t("student_type")}>
          <Select
            mode="multiple"
            showSearch
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("input_student_type")}
            onChange={handleChangeStudentType}
          >
            {studentTypes.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* Lịch học */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" onClick={openMessage}>
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddClass;
