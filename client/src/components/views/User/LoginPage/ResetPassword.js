import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LoginPage.scss";
import { Modal, Button, Form, Input } from "antd";
// import { resetPassword } from "../../../../_actions/user_actions";

function ResetPassword(props) {
  const { t } = useTranslation();
  const [showPopupResetPassword, setPopupResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  // const [formErrorMessage, setFormErrorMessage] = useState("");
  // const {
  //   // values,
  //   // touched,
  //   // errors,
  //   // isSubmitting,
  //   // handleChange,
  //   // handleBlur,
  //   // handleSubmit,
  // } = props;

  const showModal = () => {
    setPopupResetPassword(true);
  };

  const handleOk = () => {
    setPopupResetPassword(false);
    // onSubmit={(values, { setSubmitting }) => {
    //   setTimeout(() => {
    //     let dataToSubmit = {
    //       email: values.email,
    //       password: values.password,
    //     };

    //     dispatch(loginUser(dataToSubmit))
    //       .then((response) => {
    //         if (response.payload.loginSuccess) {
    //           window.localStorage.setItem(
    //             "userId",
    //             response.payload.userId
    //           );
    //           props.history.push("/");
    //         } else {
    //           setFormErrorMessage(t("error_email_or_password_message"));
    //         }
    //       })
    //       .catch((err) => {
    //         setFormErrorMessage(t("fail_to_login"));
    //         setTimeout(() => {
    //           setFormErrorMessage("");
    //         }, 3000);
    //       });
    //     setSubmitting(false);
    //   }, 500);
    // }}
  };

  const handleCancel = () => {
    setPopupResetPassword(false);
  };

  const handleChange = (event) => {
    setResetEmail(event.target.value)
  }

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
            className={
              resetEmail === ""
                ? "reset-pass-button-disable"
                : ""
            }
            disabled={resetEmail === ""}
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
              value={resetEmail}
              onChange={handleChange}
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
