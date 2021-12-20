import React from "react";
import { withRouter } from "react-router-dom";
// import { loginUser } from "../../../../_actions/user_actions";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button, Typography } from "antd";
// import { useDispatch } from "react-redux";
import "./ResetPassword.scss";

const { Title } = Typography;

function ResetPassword(props) {
  const { t } = useTranslation();

  const initialEmail = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")
    : "";

  return (
    <div className="resetpwd-area">
      <Formik
        initialValues={{
          email: initialEmail,
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(t("invalid_email_message"))
            .required(t("required_email_message")),
          password: Yup.string()
            .min(8, t("required_min_length_of_password_message"))
            .required(t("required_password_message")),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref("password"), null], t("required_confirm_password_must_match_message"))
            .required(t("required_confirm_password_message")),
        })}
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
        //           if (rememberMe === true) {
        //             window.localStorage.setItem("rememberMe", values.id);
        //           } else {
        //             localStorage.removeItem("rememberMe");
        //           }
        //           props.history.push("/");
        //         } else {
        //           setFormErrorMessage(
        //             "Check out your Account or Password again" // xử lý translation 
        //           );
        //         }
        //       })
        //       .catch((err) => {
        //         setFormErrorMessage(
        //           "Check out your Account or Password again" // xử lý translation 
        //         );
        //         setTimeout(() => {
        //           setFormErrorMessage("");
        //         }, 3000);
        //       });
        //     setSubmitting(false);
        //   }, 500);
        // }}
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
                {t("reset_password")}
              </Title>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onSubmit={handleSubmit}
                style={{ width: "100%" }}
              >
                <Form.Item label={t("email")} required>
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

                <Form.Item label={t("password")} required>
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

                <Form.Item label={t("password_confirm")} required>
                  <Input
                    id="passwordConfirm"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={t("input_password_confirm")}
                    type="password"
                    value={values.passwordConfirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      (!values.passworConfirm || errors.passwordConfirm) &&
                      touched.passwordConfirm
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {(!values.passworConfirm || errors.passwordConfirm) &&
                    touched.password && (
                      <div className="input-feedback">
                        {errors.passwordConfirm}
                      </div>
                    )}
                </Form.Item>
                <a
                  className="back_to_login"
                  href="/login"
                  style={{ float: "right" }}
                >
                  {t("back_to_login")}
                </a>
                <div style={{ marginTop: "20%" }}>
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
                    {t("reset_password")}
                  </Button>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default withRouter(ResetPassword);
