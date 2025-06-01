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
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(to right, #a1d6e2,rgb(132, 154, 158))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: 420,
          padding: "40px 32px",
          borderRadius: 16,
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          Đăng Nhập
        </Typography.Title>

        {/* Email */}
        <div style={{ marginBottom: 24 }}>
          <Input
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            status={touched.email && errors.email ? "error" : ""}
            style={{
              height: 48,
              borderRadius: 10,
              fontSize: 16,
              borderColor: "#ccc",
              padding: "0 12px",
            }}
          />
          {touched.email && errors.email && (
            <Typography.Text type="danger">{errors.email}</Typography.Text>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 32 }}>
          <Input.Password
            name="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            status={touched.password && errors.password ? "error" : ""}
            style={{
              height: 48,
              borderRadius: 10,
              fontSize: 16,
              borderColor: "#ccc",
              padding: "0 12px",
            }}
          />
          {touched.password && errors.password && (
            <Typography.Text type="danger">{errors.password}</Typography.Text>
          )}
        </div>

        {/* Submit */}
        <ButtonCustom htmlType="submit" type="text" text="Đăng Nhập" block />

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
            Đăng Ký
          </Link>
          <Link
            to="/account/forgotPassword"
            style={{
              textDecoration: "none",
              color: "#6e6060",
              fontWeight: 500,
            }}
          >
            Quên Mật Khẩu
          </Link>
        </div>
      </form>
    </div>
  );
}
