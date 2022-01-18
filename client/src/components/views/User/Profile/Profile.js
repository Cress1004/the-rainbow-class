import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form, Modal, Input } from "antd";
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
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState({});
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    Axios.post(`/api/users/profile`, { userId: userId }).then((response) => {
      if (response.data.success) {
        const data = response.data.userData;
        setUserData(data);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
    setPassword({ userId: userId });
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
        console.log(response.data.link)
        setUserData({ ...userData, image: response.data.link });
        setShowChangeAvatar(true);
      } else {
        alert(t("fail_to_upload_avatar"));
      }
    });
  };

  const submitSaveAvatar = () => {
    Axios.post(`/api/users/change-avatar`, userData).then((response) => {
      if (response.data.success) {
        setShowChangeAvatar(false);
        window.location.reload();
      } else {
        alert(t("fail_to_save_avatar"));
      }
    });
  };

  const changeAvatar = () => {
    setShowChangeAvatar(true);
  };

  const submitChangePassword = () => {
    Axios.post(`/api/users/change-password`, password).then((response) => {
      if (response.data.success) {
        const result = response.data.result;
        console.log(result);
        if(!result) {
          setShowChangePassword(false);
          setPassword({userId: userId})
        };
      } else {
        alert(t("fail_to_save_avatar"));
      }
    });
  };

  const checkConfirmPassword = (e) => {
    const value = e.target.value;
    if (password.newPass == value) {
      setPassword({ ...password, passConfirm: value });
      setErrorMessage(undefined);
    } else {
      setErrorMessage(t("confirm_password_is_not_match"));
    }
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
          <Button
            type="primary"
            className="profile__change-password-button"
            onClick={() => setShowChangePassword(true)}
          >
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
              {showChangeAvatar ? (
                <div>
                  <input type="file" onChange={(e) => handleChangeAvatar(e)} />
                  <Button onClick={submitSaveAvatar}>{t("save_avatar")}</Button>
                </div>
              ) : (
                <Button onClick={changeAvatar}>{t("change_avatar")}</Button>
              )}
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
      <Modal
        className="profile__change-password"
        title={t("modal_change_password_title")}
        visible={showChangePassword}
        onOk={submitChangePassword}
        onCancel={() => setShowChangePassword(false)}
        okText={t("change_password")}
        cancelText={t("cancel")}
        footer={[
          <Button
            type="primary"
            onClick={submitChangePassword }
            disabled={errorMessage}
            className={
              errorMessage ? "disable-submit-button" : "enable-submit-lesson"
            }
          >
            {t("change_password")}
          </Button>,
          <Button onClick={() => setShowChangePassword(false)}>
            {t("cancel")}
          </Button>,
        ]}
      >
        <Form {...layout} className="profile__change-password-form">
          <Item label={t("old_password")}>
            <Input
              type="password"
              onChange={(e) =>
                setPassword({ ...password, oldPass: e.target.value })
              }
            />
          </Item>
          <Item label={t("new_password")}>
            <Input
              type="password"
              onChange={(e) =>
                setPassword({ ...password, newPass: e.target.value })
              }
            />
          </Item>
          <Item label={t("confirm_new_password")}>
            <Input type="password" onChange={(e) => checkConfirmPassword(e)} />
          </Item>
          <span className="error__modal-error">{errorMessage}</span>
        </Form>
      </Modal>
    </div>
  );
}

export default Profile;
