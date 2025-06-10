import React from "react";
import { Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";
import { registerAction } from "../../Redux/Actions/AuthAction/AuthAction";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChangeWithTouch = (e) => {
    const { name, value } = e.target;
    formik.setFieldTouched(name, true); // Đánh dấu là đã chạm vào
    formik.setFieldValue(name, value); // Cập nhật giá trị
  };

  const formik = useFormik({
    initialValues: {
      displayName: "",
      password: "",
      email: "",
      role: "USER",
    },
    validateOnChange: true,
    validateOnBlur: false,
    validate: (values) => {
      const errors = {};
      const emailRegex =
        /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      const displayNameRegex = /^(?=(?:.*[A-Za-z]){2,})[A-Za-z0-9]{4,10}$/;

      // Check error tên hiển thị
      if (!values.displayName) {
        errors.displayName = "Please enter account name!";
      } else if (!displayNameRegex.test(values.displayName)) {
        errors.displayName =
          "Account name must be 4 ~ 10 characters, letters and numbers only, include 2 character!";
      }
      // Check error password
      if (!values.password) {
        errors.password = "Please enter password!";
      } else if (!passwordRegex.test(values.password)) {
        errors.password =
          "Password must be at least 8 characters, include 1 uppercase letter and 1 special character!";
      }
      // Check error email
      if (!values.email) {
        errors.email = "Please enter email!";
      } else if (!emailRegex.test(values.email)) {
        errors.email =
          "Invalid email format, Please enter your email useremail@example.com!";
      }
      if (!values.xacNhanMatKhau)
        errors.xacNhanMatKhau = "Please re-enter password!";
      else if (values.xacNhanMatKhau !== values.password)
        errors.xacNhanMatKhau = "Passwords do not match!";
      return errors;
    },
    onSubmit: async (values) => {
      const { xacNhanMatKhau, ...registerData } = values;
      try {
        await dispatch(registerAction(registerData, navigate));
      } catch (error) {
        // đã xử lý lỗi ở trong action
      }
    },
  });

  return (
    <div className="h-screen bg-gradient-to-r from-[#a1d6e2] to-[#849a9e] flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-[420px] max-[376px]:max-w-[350px] p-8 md:p-10 rounded-[10px] shadow-xl"
        noValidate
      >
        <Typography.Title
          level={3}
          className="text-center mb-8 text-[22px] md:text-[24px]"
        >
          Register a user account
        </Typography.Title>

        {/* displayName */}
        <div className="mb-6">
          {formik.touched.displayName && formik.errors.displayName && (
            <Typography.Text type="danger">
              * {formik.errors.displayName}
            </Typography.Text>
          )}
          <Input
            name="displayName"
            placeholder="Account name"
            autoComplete="displayName"
            value={formik.values.displayName}
            onChange={handleChangeWithTouch}
            status={
              formik.touched.displayName && formik.errors.displayName
                ? "error"
                : "success"
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          {formik.touched.password && formik.errors.password && (
            <Typography.Text type="danger">
              * {formik.errors.password}
            </Typography.Text>
          )}
          <Input.Password
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={handleChangeWithTouch}
            status={
              formik.touched.password && formik.errors.password
                ? "error"
                : "success"
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>

        {/* XÁC NHẬN MẬT KHẨU */}
        <div className="mb-6">
          {formik.touched.xacNhanMatKhau && formik.errors.xacNhanMatKhau && (
            <Typography.Text type="danger">
              * {formik.errors.xacNhanMatKhau}
            </Typography.Text>
          )}
          <Input.Password
            name="xacNhanMatKhau"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={formik.values.xacNhanMatKhau}
            onChange={handleChangeWithTouch}
            status={
              formik.touched.xacNhanMatKhau && formik.errors.xacNhanMatKhau
                ? "error"
                : "success"
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />{" "}
        </div>

        {/* EMAIL */}
        <div className="mb-6">
          {formik.touched.email && formik.errors.email && (
            <Typography.Text type="danger">
              * {formik.errors.email}
            </Typography.Text>
          )}
          <Input
            name="email"
            placeholder="useremail@example.com"
            autoComplete="email"
            value={formik.values.email}
            onChange={handleChangeWithTouch}
            status={
              formik.touched.email && formik.errors.email ? "error" : "success"
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>

        {/* ĐĂNG KÝ */}
        <ButtonCustom htmlType="submit" type="text" text="Register" block />

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#1890ff",
                fontWeight: 500,
              }}
            >
              Login
            </Link>
          </Typography.Text>
        </div>
      </form>
    </div>
  );
}
