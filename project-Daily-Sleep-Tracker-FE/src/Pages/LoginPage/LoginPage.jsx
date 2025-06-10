import React from "react";
import { Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

import { loginAction } from "../../Redux/Actions/AuthAction/AuthAction";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";
import { emailRegex, passwordRegex } from "../../Utils/Validators/regex";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChangeWithTouch = (e) => {
    const { name, value } = e.target;
    formik.setFieldTouched(name, true); // Đánh dấu là đã chạm vào
    formik.setFieldValue(name, value); // Cập nhật giá trị
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: true,
    validateOnBlur: false,
    validate: (values) => {
      const errors = {};
      // Check error email
      if (!values.email) {
        errors.email = "Please enter email!";
      } else if (values.email.length < 5 || values.email.length > 70) {
        errors.email = "Email must be between 5 and 70 characters!";
      } else if (!emailRegex.test(values.email)) {
        errors.email =
          "Invalid email format, Please enter your email useremail@example.com!";
      }
      // Check error password
      if (!values.password) {
        errors.password = "Please enter password!";
      } else if (!passwordRegex.test(values.password)) {
        errors.password =
          "Password must be at least 8 characters, include 1 uppercase letter and 1 special character!";
      }
      return errors;
    },
    onSubmit: (values) => {
      dispatch(loginAction(values, navigate));
    },
  });

  const { handleSubmit, values, errors, touched } =
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
          {touched.email && errors.email && (
            <Typography.Text type="danger">{errors.email}</Typography.Text>
          )}
          <Input
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            onChange={handleChangeWithTouch}
            status={touched.email && errors.email ? "error" : "success"}
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          {touched.password && errors.password && (
            <Typography.Text type="danger">{errors.password}</Typography.Text>
          )}
          <Input.Password
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChangeWithTouch}
            status={touched.password && errors.password ? "error" : ""}
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
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
