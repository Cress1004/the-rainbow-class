import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LoginPage.scss";
import { Modal, Button, Form, Input } from "antd";

function ResetPassword(props) {
  const { t } = useTranslation();
  const [showPopupResetPassword, setPopupResetPassword] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  const showModal = () => {
    setPopupResetPassword(true);
  };

  const handleOk = () => {
    setPopupResetPassword(false);
    // send email to reset password
  };

  const handleCancel = () => {
    setPopupResetPassword(false);
  };

  return (
    <div>
      <a
        className="login-form-forgot"
        onClick={showModal}
        style={{ float: "right" }}
      >
        {t("forgot_password")}
      </a>
      <Modal
        style={{ textAlign: "center" }}
        className="reset-password-modal"
        title={t("reset_password")}
        onCancel={handleCancel}
        visible={showPopupResetPassword}
        footer={[
          <Button onClick={handleCancel}>{t("cancel")}</Button>,
          <Button
            type="primary"
            onClick={handleOk}
            // className={
            //   values.resetEmail === "" || errors.resetEmail
            //     ? "reset-pass-button-disable"
            //     : ""
            // }
            // disabled={values.resetEmail === "" || errors.resetEmail}
          >
            {t("ok")}
          </Button>,
        ]}
      >
        <p>{t("reset_password_message")}</p>
        {/* <Form initialValues={{ resetEmail: "" }}> */}
          <Form.Item className="input-reset-email">
            <Input
              id="resetEmail"
              name="resetEmail"
              //value={values.resetEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: "60%" }}
              placeholder={t("reset_email")}
              rules={[
                { required: true, message: t("required_email_message") },
                {
                  type: "email",
                  message: t("invalid_email_message"),
                },
              ]}
            />
            {/* {errors.resetEmail && touched.resetEmail && (
                    <div className="input-feedback">{errors.email}</div>
                  )} */}
          </Form.Item>
        {/* </Form> */}
      </Modal>
    </div>
  );
}

export default ResetPassword;
