/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
// import {DownOutlined} from '@ant-design/icons';
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed"); // Xu ly translation 
      }
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile"><a href="/profile">Profile</a></Menu.Item>
      <Menu.Item key="logout"><a onClick={logoutHandler}>Logout</a></Menu.Item>
    </Menu>
  );

  if (user.userData && !user.userData.isAuth) {
    // return (
    //   <Menu mode={props.mode}>
    //     <Menu.Item key="mail">
    //       <a href="/login">Signin</a>
    //     </Menu.Item>
    //   </Menu>
    // );
    return (
      // <Menu mode={props.mode}>
      //   <Menu.Item key="logout">
      //     <a onClick={logoutHandler}>Logout</a>
      //   </Menu.Item>
      // </Menu>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <Avatar src="/image/default-image.jpg" style={{ width: "40px", height: "40px" }} />{" User Name"}
          {/* <DownOutlined /> */}
        </a>
      </Dropdown>
    );
  } else {
    return null;
  }
}

export default withRouter(RightMenu);
