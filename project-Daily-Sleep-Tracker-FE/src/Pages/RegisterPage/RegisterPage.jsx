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

  const formik = useFormik({
    initialValues: {
      displayName: "",
      password: "",
      email: "",
      role: "USER",
    },
    validate: (values) => {
      const errors = {};
      if (!values.displayName)
        errors.displayName = "Please enter account name!";
      if (!values.password) errors.password = "Please enter password!";
      if (!values.email) errors.email = "Please enter email!";
      if (!values.xacNhanMatKhau)
        errors.xacNhanMatKhau = "Please re-enter password!";
      else if (values.xacNhanMatKhau !== values.password)
        errors.xacNhanMatKhau = "Passwords do not match!";
      return errors;
    },
    onSubmit: async (values) => {
      const { xacNhanMatKhau, ...registerData } = values;
      try {
        await dispatch(registerAction(registerData));
        navigate("/login");
      } catch (error) {
        // đã xử lý lỗi ở trong action
      }
    },
  });

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#a1d6e2] to-[#849a9e] flex justify-center items-center">
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
          <Input
            name="displayName"
            placeholder="Account name"
            autoComplete="displayName"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={
              formik.touched.displayName && formik.errors.displayName
                ? "error"
                : ""
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>
        {formik.touched.displayName && formik.errors.displayName && (
          <Typography.Text type="danger">
            {formik.errors.displayName}
          </Typography.Text>
        )}

        {/* PASSWORD */}
        <div className="mb-6">
          <Input.Password
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={
              formik.touched.password && formik.errors.password ? "error" : ""
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <Typography.Text type="danger">
            {formik.errors.password}
          </Typography.Text>
        )}

        {/* XÁC NHẬN MẬT KHẨU */}
        <div className="mb-6">
          <Input.Password
            name="xacNhanMatKhau"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={formik.values.xacNhanMatKhau}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={
              formik.touched.xacNhanMatKhau && formik.errors.xacNhanMatKhau
                ? "error"
                : ""
            }
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />{" "}
        </div>
        {formik.touched.xacNhanMatKhau && formik.errors.xacNhanMatKhau && (
          <Typography.Text type="danger">
            {formik.errors.xacNhanMatKhau}
          </Typography.Text>
        )}

        {/* EMAIL */}
        <div className="mb-6">
          <Input
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={formik.touched.email && formik.errors.email ? "error" : ""}
            className="h-[45px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>

        {formik.touched.email && formik.errors.email && (
          <Typography.Text type="danger">{formik.errors.email}</Typography.Text>
        )}

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
