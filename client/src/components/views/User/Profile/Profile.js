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
  const [showChange, setShowChange] = useState(false);
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

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    Axios.post(`/api/upload/upload-avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      if (response.data.success) {
        setUserData({ ...userData, image: response.data.link });
        setShowChange(true);
      } else {
        alert(t("fail_to_upload_avatar"));
      }
    });
  };

  const submitSaveAvatar = () => {
    Axios.post(`/api/users/change-avatar`, userData).then((response) => {
      if (response.data.success) {
        setShowChange(false);
        window.location.reload();
      } else {
        alert(t("fail_to_save_avatar"));
      }
    });
  };

  const changeAvatar = () => {
    setShowChange(true);
  }

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
            {t("change_password")}
          </Button>
        </Col>
      </Row>
      {userData && (
        <>
          <Row>
            <Col className="profile__left-block" span={6}>
              <img
                encType="multipart/form-data"
                className="profile__avatar"
                src={userData.image}
                alt="user-avatar"
                id="file"
              ></img>
              {showChange ? (
                <div>
                  <input type="file" onChange={(e) => handleChangeAvatar(e)} />
                  <Button onClick={submitSaveAvatar}>{t("save_avatar")}</Button>
                </div>
              ) : 
              <Button onClick={changeAvatar}>{t('change_avatar')}</Button>}
            </Col>
            <Col className="profile__right-block" span={18}>
              <Form {...layout} className="profile__info-area">
                <Item label={t("user_name")}>{userData.name}</Item>
                <Item label={t("email")}>{userData.email}</Item>
                <Item label={t("phone_number")}>{userData.phoneNumber}</Item>
                <Item label={t("address")}>
                  {transformAddressData(userData.address)}
                </Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Profile;
