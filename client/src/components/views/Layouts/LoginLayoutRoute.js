import React from "react";
import { Route } from "react-router-dom";
import { Typography } from "antd";

import "./style.scss";

const { Title } = Typography;

const t = (string) => {
      return string;
    };

const LoginLayout = ({ children }) => (
  <div>
    <div className="login-background">
      <div className="info-area">
        <Title level={3}>{t("app:welcome_message")}</Title>
        <br />
        <img
          className="logo"
          height="70%"
          width="70%"
          src="/images/logo.png"
          alt="logo"
        />
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const LoginLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <LoginLayout>
          <Component {...matchProps} />
        </LoginLayout>
      )}
    />
  );
};

export default LoginLayoutRoute;
