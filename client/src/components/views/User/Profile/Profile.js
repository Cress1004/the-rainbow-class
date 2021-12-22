import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form } from "antd";
import { Link } from "react-router-dom";
import Axios from "axios";
import "./profile.scss";
import { transformAddressData } from "../../../common/transformData";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function Profile() {
  const [userData, setUserData] = useState({});
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    Axios.post(`/api/users/profile`, { userId: userId }).then((response) => {
      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, userId]);
  console.log(userData);

  const handleChangeAvatar = (e) => {
    // setUserData({...userData, image: e.target.value})
  };

  //Ngay sinh, dia chi
  return (
    <div>
      <div className="profile__title">{t("profile")}</div>
      <Row>
        <Col span={14} />
        <Col span={5}>
          <Button type="primary" className="profile__edit-button">
            <Link to={`/profile/edit`}>{t("edit_profile")}</Link>
          </Button>
        </Col>
        <Col span={5}>
        <Button type="primary" className="profile__change-password-button">
              {t('change_password')}
          </Button>
        </Col>
      </Row>
      {userData && (
        <>
          <Row>
            <Col className="profile__left-block" span={6}>
              <img
                className="profile__avatar"
                src={userData.image}
                alt="user-avatar"
              ></img>
              <input type="file" onChange={(e) => handleChangeAvatar(e)} />
            </Col>
            <Col className="profile__right-block" span={18}>
              <Form {...layout} className="profile__info-area">
                <Item label={t("user_name")}>{userData.name}</Item>
                <Item label={t("email")}>{userData.email}</Item>
                <Item label={t("phone_number")}>{userData.phoneNumber}</Item>
                <Item label={t("address")}>{transformAddressData(userData.address)}</Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Profile;
