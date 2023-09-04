import React, { useState } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import firebase from "firebase/compat/app";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import nic from "../../assets/images/nic.png";
import {Link, useLocation } from "react-router-dom";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();
  let { user } = useSelector((state) => ({ ...state }));

  let history = useNavigate();

  const location = useLocation();
  const currentPage = location.pathname;

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history("/login");
  };

  // base URL
  const isBaseUrl = window.location.pathname === "/";

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
      style={{
        height: "60px",
        background: "linear-gradient(to right, #c6fad2, #f6ffee)",
      }}
    >
      <Item key="logo" style={{ borderBottom: "none" }}>
        <Link to="/">
          <img
            src={nic}
            alt="Logo"
            style={{ height: "60px", pointerEvents: "none", cursor: "default" }}
          />
        </Link>
      </Item>
      <div className="ml-auto mr-3 mt-2">
        {user ? (
          <SubMenu
            icon={<SettingOutlined />}
            title={user.email && user.email.split("@")[0]}
            style={{ fontSize: 18 }}
          >
            <Item icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Item>
          </SubMenu>
        ) : (
          <>
            {currentPage !== "/register" && (
              <Item key="register" icon={<UserAddOutlined />}>
                <Link to="/register">Register</Link>
              </Item>
            )}
            {currentPage !== "/login" && (
              <Item key="login" icon={<UserOutlined />}>
                <Link to="/login">Login</Link>
              </Item>
            )}
          </>
        )}

        
        {isBaseUrl && user && (
            <Link
            to="/project"
            style={{
              marginLeft: "10px",
              backgroundColor: "#adf576",
              color: "green",
              padding: "8px 16px",
              fontSize: "14px",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
        )}
      </div>
    </Menu>
  );
};

export default Header;
