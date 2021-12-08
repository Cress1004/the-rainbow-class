import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { useParams } from "react-router";
import { Form, Input, Select, Button, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

function EditClass(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const key = "updatable";
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };
  const { id } = useParams();
  const variable = { useForm: localStorage.getItem("userId") };
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [classData, setClassData] = useState({});
  const [province, setProvince] = useState({});
  const [studentTypes, setStudentTypes] = useState([]);
  const [types, setTypes] = useState([]);
  useEffect(() => {
    Axios.post("/api/common-data/location", variable).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api_location"));
      }
    });

    Axios.post("/api/common-data/student-types", variable).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } else {
        alert(t("fail_to_get_api_student_types"));
      }
    });

    Axios.post(`/api/classes/${id}`, { classId: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.classData;
        setClassData(data);
        setProvince(data.address.address.province);
        setDistrict(data.address.address.district);
        setWard(data.address.address.ward);
        setTypes(data.student_types.map((type) => type._id));
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
    setClassData({
      ...classData,
      address: {
        address: {
          province: {
            id: currentProvince.id,
            name: currentProvince.name,
          },
        },
        description: classData.address.description,
      },
    });
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({ id: currentDistrict.id, name: currentDistrict.name });
    setWards(currentDistrict.wards);
    setWard({});
    setClassData({
      ...classData,
      address: {
        address: {
          province: classData.address.address.province,
          district: {
            id: currentDistrict.id,
            name: currentDistrict.name,
          },
        },
        description: classData.address.description,
      },
    });
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({ id: currentWard.id, name: currentWard.name });
    setClassData({
      ...classData,
      address: {
        address: {
          province: classData.address.address.province,
          district: classData.address.address.district,
          ward: {
            id: currentWard.id,
            name: currentWard.name,
          },
        },
        description: classData.address.description,
      },
    });
  };

  const handleChangeStudentType = (value) => {
    setTypes(value);
    setClassData({ ...classData, student_types: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`/api/classes/${id}/edit`, classData).then((response) => {
      if (response.data.success) {
        openMessage();
        history.push(`/classes/${id}`);
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
  console.log(classData);
  return (
    <div className="edit-class">
      <div className="edit-class__title">{t("edit_class")}</div>
      {classData && (
        <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
          <Form.Item
            name="name"
            label={t("class_name")}
            rules={[
              { required: true, validateMessages: t("required_class_name") },
            ]}
          >
            <Input
              value={classData.class_name}
              placeholder={t("input_class_name")}
              onChange={(e) =>
                setClassData({ ...classData, class_name: e.target.value })
              }
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
              value={classData.description}
              placeholder={t("input_description")}
              onChange={(e) =>
                setClassData({ ...classData, description: e.target.value })
              }
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
              value={province.name}
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
              value={district.name}
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
              value={ward.name}
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
              value={classData.address ? classData.address.description : ""}
              placeholder={t("input_specific_address")}
              onChange={(e) => {
                setClassData({
                  ...classData,
                  address: {
                    address: classData.address.address, 
                    description: e.target.value 
                  },
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
              value={types}
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
              {t("update")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default EditClass;
