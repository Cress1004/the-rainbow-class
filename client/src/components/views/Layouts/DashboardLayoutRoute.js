import React, { useState } from "react";
import { Route } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { Link } from 'react-router-dom';
import "./style.scss";
import RightMenu from "../NavBar/Sections/RightMenu";

const { Title } = Typography;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const DashboardLayout = ({ children, ...rest }) => {
  const t = (string) => {
    return string;
  };

  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout>
      <Header>
        <Title level={3} className="class-name">
          <a href="/">{t("Lớp học Cầu Vồng - The Rainbow Class")}</a>
        </Title>
        <div className="login-menu">
          <RightMenu />
        </div>
      </Header>
      <Content>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
            {/* <div className="logo" /> */}
            <Menu defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="my_schedule"><Link to="/dashboard">Dashboard</Link></Menu.Item>
              <Menu.Item key="2">Schedule Manager</Menu.Item>
              <SubMenu key="sub1" title="User">
                <Menu.Item key="3">Admin</Menu.Item>
                <Menu.Item key="4">Class Monitor</Menu.Item>
                <Menu.Item key="5">Volunteer</Menu.Item>
                <Menu.Item key="6">Student</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title="Class Manager">
                <Menu.Item key="class_list"><Link to="/classes">Class List</Link></Menu.Item>
                <Menu.Item key="8">InRegister Student</Menu.Item>
                <Menu.Item key="9">InRegister Volunteer</Menu.Item>
              </SubMenu>
              <Menu.Item key="10">Events</Menu.Item>
            </Menu>
          </Sider>
          {/* <Content className="main-container site-layout-background">{children}</Content> */}
          <Layout className="site-layout">
            <Content>
              <div className="site-layout-background">{children}</div>
            </Content>
          </Layout>
        </Layout>
      </Content>
    </Layout>
  );
};

const DashboardLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Content className="content site-layout-background">
          <DashboardLayout>
            <Component {...matchProps} />
          </DashboardLayout>
        </Content>
      )}
    />
  );
};

export default DashboardLayoutRoute;
