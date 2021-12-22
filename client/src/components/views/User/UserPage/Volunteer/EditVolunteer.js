import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { Button, Form, Input, Select, Radio } from "antd";
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

function EditVolunteer(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const [volunteerData, setVolunteerData] = useState({});
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});

  useEffect(() => {
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
    Axios.post("/api/volunteers/:id", { id: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.volunteer;
        setVolunteerData({
          id: data._id,
          name: data.user.name,
          email: data.user.email,
          gender: data.user.gender,
          address: data.user.address,
          phoneNumber: data.user.phoneNumber,
          role: data.role,
          className: data.class.name,
        });
        if (data.user.address.address) {
          setProvince(data.user.address.address.province);
          setDistrict(data.user.address.address.district);
          setWard(data.user.address.address.ward);
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
    setVolunteerData({
      ...volunteerData,
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
    setVolunteerData({
      ...volunteerData,
      address: {
        address: {
          province: volunteerData.address.address.province,
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
    setVolunteerData({
      ...volunteerData,
      address: {
        address: {
          province: volunteerData.address.address.province,
          district: volunteerData.address.address.district,
          ward: {
            id: currentWard.id,
            name: currentWard.name,
          },
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setVolunteerData({
      ...volunteerData,
      address: {
        address: volunteerData.address.address,
        description: e.target.value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`/api/volunteers/${id}/edit`, volunteerData).then((response) => {
      if (response.data.success) {
        history.push(`/volunteers/${id}`);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  };

  return (
    <div className="edit-volunteer">
      <div className="edit-volunteer__title">{t("edit_volunteer")}</div>
      <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
        <Form.Item
          name="name"
          label={t("user_name")}
          rules={[{ required: true, validateMessages: t("required_name") }]}
        >
          <Input
            placeholder={t("input_name")}
            value={volunteerData.name}
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
            value={volunteerData.email}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, email: e.target.value })
            }
            disabled={true}
          />
        </Form.Item>
        <Form.Item name="phone_number" label={t("phone_number")}>
          <Input
            placeholder={t("input_phone_number")}
            value={volunteerData.phoneNumber}
            onChange={(e) =>
              setVolunteerData({
                ...volunteerData,
                phoneNumber: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item name="gender" label={t("gender")}>
          <Radio.Group
            value={volunteerData.gender}
            onChange={(e) =>
              setVolunteerData({ ...volunteerData, gender: e.target.value })
            }
          >
            <Radio value={0}>{t("male")}</Radio>
            <Radio value={1}>{t("female")}</Radio>
          </Radio.Group>
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
            value={province.name}
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
          <Input
            value={
              volunteerData.address ? volunteerData.address.description : ""
            }
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
        </Form.Item>
        <Form.Item name="class" label={t("class")}>
          <Input
            disabled={true}
            value={
              volunteerData.className ? volunteerData.className : t("unset")
            }
          />
        </Form.Item>
        <Form.Item name="role" label={t("role")}>
          <Radio.Group value={volunteerData.role} disabled={true}>
            <Radio value={0}>{t("volunteer")}</Radio>
            <Radio value={1}>{t("class_monitor")}</Radio>
            <Radio value={2}>{t("sub_class_monitor")}</Radio>
            <Radio value={3}>{t("admin")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("update")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditVolunteer;
