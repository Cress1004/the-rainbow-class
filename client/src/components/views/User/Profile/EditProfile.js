import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Radio } from "antd";
import Axios from "axios";
import "./profile.scss";

const { Option } = Select;
const { Item } = Form;

function EditProfile(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem("userId");
  
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  useEffect(() => {
    Axios.post(`/api/users/profile`, { userId: userId }).then((response) => {
      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, userId]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    Axios.post(`/api/users/profile/edit`, { userData: userData }).then((response) => {
        if (response.data.success) {
        console.log("update success");
        } else {
          alert(t("fail_to_get_api"));
        }
      });
  };

  return (
    <div className="edit-user">
      <div className="edit-user__title">{t("edit_profile")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="edit-user__form"
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
            onChange={(e) =>
              setUserData({ ...userData, name: e.target.value })
            }
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
            value={userData.phone_number}
            placeholder={t("input_phone_number")}
            onChange={(e) =>
              setUserData({
                ...userData,
                phone_number: e.target.value,
              })
            }
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
