import React, { useState } from "react";
import { Route } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { Link } from "react-router-dom";
import "./style.scss";
import RightMenu from "../NavBar/Sections/RightMenu";
import { useTranslation } from "react-i18next";
import {
  ADMIN,
  CLASS_MONITOR,
  STUDENT,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
  VOLUNTEER,
} from "../../common/constant";
import useFetchRole from "../../../hook/useFetchRole";

const { Title } = Typography;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const DashboardLayout = ({ children, ...rest }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const userId = localStorage.getItem("userId");
  const userData = useFetchRole(userId);
  const userRole = userData.userRole;
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
        {userRole && (
          <Layout>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={handleCollapse}
            >
              {userRole.role === STUDENT && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="my_schedule">
                    <Link to="/dashboard">{t("dashboard")}</Link>
                  </Menu.Item>
                  <Menu.Item key="volunteers">
                      {t("volunteer")}
                      <Link to="/volunteers"></Link>
                    </Menu.Item>
                    <Menu.Item key="students">
                      {t("student")}
                      <Link to="/students"></Link>
                    </Menu.Item>
                </Menu>
              )}
              {userRole.subRole === SUPER_ADMIN && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="list_admin">
                    <Link to="/admins">{t("admins")}</Link>
                  </Menu.Item>
                </Menu>
              )}
              {userRole.subRole === ADMIN && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="my_schedule">
                    <Link to="/dashboard">{t("dashboard")}</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/schedules">{t("schedule_manager")}</Link>
                  </Menu.Item>
                  <SubMenu key="sub1" title={t("user_manager")}>
                    <Menu.Item key="3"><Link to="/admins">{t("admin")}</Link></Menu.Item>
                    <Menu.Item key="4">{t("class_monitor")}</Menu.Item>
                    <Menu.Item key="5">
                      {t("volunteer")}
                      <Link to="/volunteers"></Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                      {t("student")}
                      <Link to="/students"></Link>
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" title={t("class_manager")}>
                    <Menu.Item key="class_list">
                      <Link to="/classes">{t("class_list")}</Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="10">
                    {t("master_setting")}
                    <Link to="/master-setting"></Link>
                  </Menu.Item>
                </Menu>
              )}
              {(userRole.subRole === SUB_CLASS_MONITOR ||
                userRole.subRole === CLASS_MONITOR ||
                userRole.subRole === VOLUNTEER) && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="my_schedule">
                    <Link to="/dashboard">{t("dashboard")}</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/schedules">{t("schedule_manager")}</Link>
                  </Menu.Item>
                  <SubMenu key="sub1" title={t("user_manager")}>
                    <Menu.Item key="3"><Link to="/admins">{t("admin")}</Link></Menu.Item>
                    <Menu.Item key="4">
                      {t("volunteer")}
                      <Link to="/volunteers"></Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                      {t("student")}
                      <Link to="/students"></Link>
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" title={t("class_manager")}>
                    <Menu.Item key="class_list">
                      <Link to="/classes">{t("class_list")}</Link>
                    </Menu.Item>
                    <Menu.Item key="10">
                      {t("class_info")}
                      <Link to="/master-setting"></Link>
                    </Menu.Item>
                  </SubMenu>
                </Menu>
              )}
            </Sider>
            <Layout className="site-layout">
              <Content>
                <div className="site-layout-background">{children}</div>
              </Content>
            </Layout>
          </Layout>
        )}
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
