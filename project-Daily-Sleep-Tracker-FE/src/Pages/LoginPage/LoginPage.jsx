import React from "react";
import { Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

import { loginAction } from "../../Redux/Actions/AuthAction/AuthAction";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Vui lòng nhập email!";
      if (!values.password) errors.password = "Vui lòng nhập mật khẩu!";
      return errors;
    },
    onSubmit: (values) => {
      dispatch(loginAction(values, navigate));
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  return (
    <div className="h-screen bg-gradient-to-r from-[#a1d6e2] to-[#849a9e] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-[420px] max-[376px]:max-w-[320px] p-8 md:p-10 rounded-[10px] shadow-xl"
      >
        <Typography.Title
          level={3}
          className="text-center mb-8 text-[22px] md:text-[24px]"
        >
          Login
        </Typography.Title>

        {/* Email */}
        <div className="mb-6">
          <Input
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            status={touched.email && errors.email ? "error" : ""}
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
          {touched.email && errors.email && (
            <Typography.Text type="danger">{errors.email}</Typography.Text>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <Input.Password
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            status={touched.password && errors.password ? "error" : ""}
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
          {touched.password && errors.password && (
            <Typography.Text type="danger">{errors.password}</Typography.Text>
          )}
        </div>

        {/* Submit */}
        <ButtonCustom htmlType="submit" type="text" text="Login" block />

        {/* Links */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            to="/register"
            style={{
              marginRight: 8,
              textDecoration: "none",
              color: "#1890ff",
              fontWeight: 500,
            }}
          >
            Resgister
          </Link>
          
          <Link
            to="/account/forgotPassword"
            style={{
              textDecoration: "none",
              color: "#6e6060",
              fontWeight: 500,
            }}
          >
            Forgot password
          </Link>
        </div>
      </form>
    </div>
  );
}
