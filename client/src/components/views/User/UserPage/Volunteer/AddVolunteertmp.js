import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Select, Button, Radio } from "antd";
import Axios from "axios";
import "./volunteer.scss";

const { Option } = Select;

function AddVolunteertmp(props) {
  const { t } = useTranslation();
  //const [role, setRole] = useState(0);
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  //const { register, handleSubmit, setValue } = useForm()
  const variable = { useForm: localStorage.getItem("userId") };
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});

  useEffect(() => {
    Axios.post("/api/common-data/location", variable).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  // const handleChangeRole = (e) => {
  //   setRole(e.target.value);
  // };

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({ id: currentDistrict.id, name: currentDistrict.name });
    setWards(currentDistrict.wards);
    setWard({});
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({ id: currentWard.id, name: currentWard.name });
  };

  // const handleSubmit = (e, values) => {
  //   // var newUser = {}
  //   // Axios.post('/api/users/add-new-volunteer', newUser)
  //   e.preventDefault();
  //   console.log(values);
  // };

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
      <div className="add-volunteer__title">{t("add_volunteer")}</div>
      <Form {...layout} name="control-hooks"
      // initialValue={{ name:'' }}
      onSubmit={(e, values) => {
        e.preventDefault();
        console.log(values)
      }}>
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
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              marginRight: "10px",
            }}
            placeholder={t("input_province")}
            value={province ? province.name : undefined}
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
            value={district ? district.name : undefined}
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
            value={ward ? ward.name : undefined}
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
          <Input placeholder={t("input_specific_address")} />
        </Form.Item>
        <Form.Item name="class" label={t("class")}>
          <Input placeholder={t("input_class")} />
        </Form.Item>
        {/* <Form.Item name="role" label={t("role")}>
          <Radio.Group onChange={handleChangeRole} value={role}>
            <Radio value={0}>{t("volunteer")}</Radio>
            <Radio value={1}>{t("class_monitor")}</Radio>
            <Radio value={2}>{t("sub_class_monitor")}</Radio>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddVolunteertmp;
