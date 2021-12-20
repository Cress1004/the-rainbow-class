import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Form, Input, Select, Button, Radio } from "antd";
import Axios from "axios";
import "./student.scss";

const { Option } = Select;
const { Item } = Form;

function AddStudent(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [studentTypes, setStudentTypes] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  useEffect(() => {
    Axios.post("/api/common-data/student-types", null).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t]);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
    setStudentData({
      ...studentData,
      address: {
        address: {
          province: {
            id: currentProvince.id,
            name: currentProvince.name,
          },
        },
      },
    });
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({ id: currentDistrict.id, name: currentDistrict.name });
    setWards(currentDistrict.wards);
    setWard({});
    setStudentData({
      ...studentData,
      address: {
        address: {
          province: studentData.address.address.province,
          district: {
            id: currentDistrict.id,
            name: currentDistrict.name,
          },
        },
      },
    });
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({ id: currentWard.id, name: currentWard.name });
    setStudentData({
      ...studentData,
      address: {
        address: {
          province: studentData.address.address.province,
          district: studentData.address.address.district,
          ward: {
            id: currentWard.id,
            name: currentWard.name,
          },
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setStudentData({
      ...studentData,
      address: {
        address: studentData.address.address,
        description: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/api/students/add-student", {
        studentData: studentData,
      });
      if (response.data.success) {
        history.push("/students");
      }
    } catch (error) {
      alert(t("fail-to-send-data"));
    }
  };

  return (
    <div className="add-student">
      <div className="add-student__title">{t("add_student")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="add-student__form"
        onSubmit={handleSubmit}
      >
        <Item
          name="name"
          label={t("user_name")}
          rules={[{ required: true, validateMessages: t("required_name") }]}
        >
          <Input
            placeholder={t("input_name")}
            onChange={(e) =>
              setStudentData({ ...studentData, name: e.target.value })
            }
          />
        </Item>
        <Item
          name="email"
          label={t("email")}
          rules={[{ required: true, validateMessages: t("required_email") }]}
        >
          <Input
            placeholder={t("input_email")}
            onChange={(e) =>
              setStudentData({ ...studentData, email: e.target.value })
            }
          />
        </Item>
        <Item name="phone_number" label={t("phone_number")}>
          <Input
            placeholder={t("input_phone_number")}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                phone_number: e.target.value,
              })
            }
          />
        </Item>
        <Item name="parent_name" label={t("parent_name")}>
          <Input
            placeholder={t("input_parent_name")}
            onChange={(e) => {
              setStudentData({ ...studentData, parent_name: e.target.value });
            }}
          />
        </Item>
        <Item name="gender" label={t("gender")}>
          <Radio.Group
            defaultValue={0}
            onChange={(e) =>
              setStudentData({ ...studentData, gender: e.target.value })
            }
          >
            <Radio value={0}>{t("male")}</Radio>
            <Radio value={1}>{t("female")}</Radio>
          </Radio.Group>
        </Item>
        <Item
          name="address"
          label={t("address")}
          className="add-student__input-address-select-form"
        >
          <Select
            value={province ? province.name : undefined}
            showSearch
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
            value={district ? district.name : undefined}
            showSearch
            placeholder={t("input_district")}
            onChange={handleChangeDistrict}
            className="add-student__input-address-center-form"
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
            value={ward ? ward.name : undefined}
            showSearch
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
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
        </Item>
        <Item name="studentType" label={t("student_type")}>
          <Select
            mode="multiple"
            showSearch
            placeholder={t("input_student_type")}
            onChange={(value) =>
              setStudentData({ ...studentData, student_types: value })
            }
          >
            {studentTypes.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Item>
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default AddStudent;
