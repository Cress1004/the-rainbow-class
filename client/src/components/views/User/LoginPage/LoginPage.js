import React, { useState } from "react";
import { loginUser } from "../../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button, Typography, Modal } from "antd";
import { useDispatch } from "react-redux";
import "./LoginPage.scss"

const { Title } = Typography;

function LoginPage(props) {
  const t = (string) => {
    return string;
  };

  const dispatch = useDispatch();
  const [showPopupResetPassword, setPopupResetPassword] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

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
    <div className="login-area">
      <Formik
        initialValues={{
          email: "",
          password: "",
          resetEmail: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Email is invalid")
            .required("Email is required"),
          resetEmail: Yup.string()
            .email("Email is invalid")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            let dataToSubmit = {
              email: values.email,
              password: values.password,
            };

            dispatch(loginUser(dataToSubmit))
              .then((response) => {
                if (response.payload.loginSuccess) {
                  window.localStorage.setItem(
                    "userId",
                    response.payload.userId
                  );
                  props.history.push("/");
                } else {
                  setFormErrorMessage(
                    "Check out your Account or Password again"
                  );
                }
              })
              .catch((err) => {
                setFormErrorMessage("Check out your Account or Password again");
                setTimeout(() => {
                  setFormErrorMessage("");
                }, 3000);
              });
            setSubmitting(false);
          }, 500);
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <div>
              <Title
                level={2}
                style={{ textAlign: "center", marginBottom: "12%" }}
              >
                {t("login")}
              </Title>
              <Form
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 13 }}
                onSubmit={handleSubmit}
                style={{ width: "100%" }}
              >
                <Form.Item label={t("input_email_address")} required>
                  <Input
                    id="email"
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={t("input_email")}
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item label={t("input_password")} required>
                  <Input
                    id="password"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={t("input_password")}
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </Form.Item>
                {formErrorMessage && (
                  <label>
                    <p
                      style={{
                        color: "#ff0000bf",
                        fontSize: "0.7rem",
                        border: "1px solid",
                        padding: "1rem",
                        borderRadius: "10px",
                      }}
                    >
                      {formErrorMessage}
                    </p>
                  </label>
                )}
                <a
                  className="login-form-forgot"
                  onClick={showModal}
                  style={{ float: "right" }}
                >
                  {t("forgot_password")}
                </a>
                <div
                  style={{
                    marginTop: "20%",
                    width: "100%",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={
                      values.email === "" ||
                      values.password === "" ||
                      errors.email ||
                      errors.password
                        ? "login-button-disable"
                        : "login-button-enable"
                    }
                    disabled={
                      isSubmitting ||
                      values.email === "" ||
                      values.password === "" ||
                      errors.email ||
                      errors.password
                    }
                    onSubmit={handleSubmit}
                  >
                    {t("login")}
                  </Button>
                </div>
              </Form>
              <Modal
                style={{ textAlign: "center" }}
                className="reset-password-modal"
                title="Đặt lại mật khẩu"
                onCancel={handleCancel}
                visible={showPopupResetPassword}
                footer={[
                  <Button onClick={handleCancel}>Quay lại</Button>,
                  <Button
                    type="primary"
                    onClick={handleOk}
                    className={
                      values.resetEmail === "" || errors.resetEmail
                        ? "reset-pass-button-disable"
                        : ""
                    }
                    disabled={values.resetEmail === "" || errors.resetEmail}
                  >
                    OK
                  </Button>,
                ]}
              >
                <p>Email cấp lại mật khẩu sẽ được gửi đến địa chỉ dưới đây:</p>
                <Form.Item className="input-reset-email">
                  <Input
                    id="resetEmail"
                    type="email"
                    value={values.resetEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: "60%" }}
                    placeholder={t("reset_email")}
                  />
                  {errors.resetEmail && touched.resetEmail && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>
              </Modal>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default LoginPage;
