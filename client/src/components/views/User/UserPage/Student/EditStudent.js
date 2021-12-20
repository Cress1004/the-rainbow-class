import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Radio } from "antd";
import { transformAddressData } from "../../../../common/transformData";
import Axios from "axios";
import "./student.scss";

const { Option } = Select;
const { Item } = Form;

function EditStudent(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [studentTypes, setStudentTypes] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const [addressDes, setAddressDes] = useState("");

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
    Axios.post(`/api/students/${id}`, { studentId: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.studentData;
        setStudentData({
          id: data._id,
          name: data.user.name,
          email: data.user.email,
          gender: data.user.gender,
          parent_name: data.parent_name,
          studentTypes: data.student_types.map((type) => type._id),
          image: data.user.image,
          phoneNumber: data.phone_number,
          className: data.class ? data.class.class_name : t("unset"),
        });
        if (data.address) {
          setProvince(data.address.address.province);
          setDistrict(data.address.address.district);
          setWard(data.address.address.ward);
          setAddressDes(data.address.description);
        }
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, id]);

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
        description: addressDes
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
        description: addressDes
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
        description: addressDes
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setAddressDes(e.target.value);
    setStudentData({
      ...studentData,
      address: {
        address: {
            province: province,
            district: district,
            ward: ward
        },
        description: addressDes,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(`/api/students/${id}/edit`, {
        studentData: studentData,
      });
      if (response.data.success) {
        // history.push("/students");
      }
    } catch (error) {
      alert(t("fail-to-send-data"));
    }
    console.log(studentData);
  };

  return (
    <div className="edit-student">
      <div className="edit-student__title">{t("edit_student")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="edit-student__form"
        onSubmit={handleSubmit}
      >
        <Item
          name="name"
          label={t("user_name")}
          rules={[{ required: true, validateMessages: t("required_name") }]}
        >
          <Input
            value={studentData.name}
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
            value={studentData.email}
            placeholder={t("input_email")}
            onChange={(e) =>
              setStudentData({ ...studentData, email: e.target.value })
            }
          />
        </Item>
        <Item name="phone_number" label={t("phone_number")}>
          <Input
            value={studentData.phoneNumber}
            placeholder={t("input_phone_number")}
            onChange={(e) =>
              setStudentData({
                ...studentData,
                phoneNumber: e.target.value,
              })
            }
          />
        </Item>
        <Item name="parent_name" label={t("parent_name")}>
          <Input
            value={studentData.parent_name}
            placeholder={t("input_parent_name")}
            onChange={(e) => {
              setStudentData({ ...studentData, parent_name: e.target.value });
            }}
          />
        </Item>
        <Item name="gender" label={t("gender")}>
          <Radio.Group
            value={studentData.gender}
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
            className="edit-student__input-address-center-form"
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
            value={addressDes}
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
        </Item>
        <Item name="studentType" label={t("student_type")}>
          <Select
            mode="multiple"
            showSearch
            value={studentData.studentTypes}
            placeholder={t("input_student_type")}
            onChange={(value) =>
              setStudentData({ ...studentData, studentTypes: value })
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
            {t("update")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default EditStudent;
