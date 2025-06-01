import React, { useContext, useEffect } from "react";
import { Layout, Input, Button, Avatar, Typography, Dropdown } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../../assets/Img/Logo/main-logo.png";
import "./HomeHeader.css";
import {
  getMyProfileAction,
  logoutAction,
} from "../../../../Redux/Actions/AuthAction/AuthAction";
import UserContext from "../../../../Context/UserContext";

const { Header } = Layout;
const { Group: InputGroup } = Input;

function HomeHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.AuthReducer);
  const { setUserId } = useContext(UserContext);
  useEffect(() => {
    // Nếu chưa có thông tin user thì gọi lại API
    if (!userProfile || Object.keys(userProfile).length === 0) {
      dispatch(getMyProfileAction());
    }
  }, [dispatch, userProfile]);
  useEffect(() => {
    if (userProfile) {
      if (Array.isArray(userProfile) && userProfile.length > 0) {
        setUserId(userProfile[0]._id);
      } else if (userProfile._id) {
        setUserId(userProfile._id);
      }
    }
  }, [userProfile, setUserId]);

  const handleLogout = async () => {
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    await dispatch(logoutAction());
    navigate("/login");
  };

  const avataMenuItems = [
    {
      key: "1",
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];
  const user = Array.isArray(userProfile) ? userProfile[0] : userProfile;
  return (
    <Header className="header-container">
      <Link
        to="/home"
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        <img
          src={logo}
          alt="Logo"
          className="logo"
          style={{ width: "200px" }}
        />
      </Link>

      {user?.displayName ? (
        <div className="flex items-center gap-3 max-w-[250px] overflow-hidden">
          <Typography.Text
            strong
            className="emailTruncate"
            style={{ maxWidth: "150px", color: "white" }}
          >
            Xin chào, {user.displayName}
          </Typography.Text>
          <Dropdown menu={{ items: avataMenuItems }} placement="bottomRight">
            <Avatar
              src={user.avatar}
              style={{ cursor: "pointer", marginLeft: 5 }}
            ></Avatar>
          </Dropdown>
        </div>
      ) : (
        <Link to="/login" className="text-white font-semibold">
          <Typography.Text strong style={{ color: "white" }}>
            Đăng nhập
          </Typography.Text>
        </Link>
      )}
    </Header>
  );
}

export default HomeHeader;
