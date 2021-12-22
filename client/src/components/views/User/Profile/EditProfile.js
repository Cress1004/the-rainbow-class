import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";
import Axios from "axios";
import "./profile.scss";

const { Item } = Form;
const { Option } = Select;

function EditProfile(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem("userId");
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
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
    Axios.post(`/api/users/profile`, { userId: userId }).then((response) => {
      if (response.data.success) {
        const data = response.data.userData; 
        setUserData(data);
        if (data.address.address) {
          setProvince(data.address.address.province);
          setDistrict(data.address.address.district);
          setWard(data.address.address.ward);
        }
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, userId]);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
    setUserData({
      ...userData,
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
    setUserData({
      ...userData,
      address: {
        address: {
          province: userData.address.address.province,
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
    setUserData({
      ...userData,
      address: {
        address: {
          province: userData.address.address.province,
          district: userData.address.address.district,
          ward: {
            id: currentWard.id,
            name: currentWard.name,
          },
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setUserData({
      ...userData,
      address: {
        address: userData.address.address,
        description: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Axios.post(`/api/users/profile/edit`, { userData: userData }).then(
      (response) => {
        if (response.data.success) {
          history.push("/profile")
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile__title">{t("edit_profile")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="edit-profile__form"
        onSubmit={handleSubmit}
      >
        <Item
          name="name"
          label={t("user_name")}
          rules={[{ required: true, validateMessages: t("required_name") }]}
        >
          <Input
            value={userData.name}
            placeholder={t("input_name")}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </Item>
        <Item
          name="email"
          label={t("email")}
          rules={[{ required: true, validateMessages: t("required_email") }]}
        >
          <Input
            value={userData.email}
            placeholder={t("input_email")}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </Item>
        <Item name="phone_number" label={t("phone_number")}>
          <Input
            value={userData.phoneNumber}
            placeholder={t("input_phone_number")}
            onChange={(e) =>
              setUserData({
                ...userData,
                phoneNumber: e.target.value,
              })
            }
          />
        </Item>
        <Item
          name="address"
          label={t("address")}
          className="edit-profile__input-address-select-form"
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
            className="edit-profile__input-address-center-form"
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
            value={
              userData.address && userData.address.description
                ? userData.address.description
                : ""
            }
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
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

export default EditProfile;
