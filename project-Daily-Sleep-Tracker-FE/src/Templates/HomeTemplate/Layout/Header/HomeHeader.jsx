import React, { useEffect } from "react";
import { Layout, Avatar, Typography, Dropdown } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../../assets/Img/Logo/main-logo.png";
import {
  getMyProfileAction,
  logoutAction,
} from "../../../../Redux/Actions/AuthAction/AuthAction";

const { Header } = Layout;

function HomeHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.AuthReducer);

  useEffect(() => {
    if (!userProfile || Object.keys(userProfile).length === 0) {
      dispatch(getMyProfileAction());
    }
  }, [dispatch, userProfile]);

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
    <Header
      className="bg-gradient-to-r from-[#f1f1f2] to-[#bcbabe] shadow-2xl h-[100px] flex items-center justify-between z-50 
  px-4 sm:px-6 md:px-10 lg:px-[150px]"
    >
      <Link to="/home" className="flex items-center h-full">
        <img
          src={logo}
          alt="Logo"
          className="logo w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px] h-auto"
        />
      </Link>

      {user?.displayName ? (
        <div className="flex items-center gap-3 max-w-[250px] overflow-hidden">
          <Typography.Text
            strong
            className="truncate text-white max-w-[150px] hidden md:inline"
          >
            Hi, {user.displayName}
          </Typography.Text>
          <Dropdown menu={{ items: avataMenuItems }} placement="bottomRight">
            <Avatar src={user.avatar} className="ml-1 cursor-pointer" />
          </Dropdown>
        </div>
      ) : (
        <Link to="/login" className="text-white font-semibold">
          <Typography.Text strong className="text-white">
            Đăng nhập
          </Typography.Text>
        </Link>
      )}
    </Header>
  );
}

export default HomeHeader;
