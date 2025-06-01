// src/pages/ResetPassword/ResetYourPassword.jsx
import React from "react";
import { Input, Typography, message } from "antd";
import { useFormik } from "formik";
import "./ResetYourPassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../ButtonCustom/ButtonCustom";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "../../Redux/Actions/AuthAction/AuthAction";
const ResetYourPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  console.log(token);

  const formik = useFormik({
    initialValues: { password: "" },
    validate: (v) => {
      const e = {};
      if (!v.password) e.password = "Vui lòng nhập mật khẩu mới!";
      else if (v.password.length < 6)
        e.password = "Mật khẩu phải có ít nhất 6 ký tự!";
      return e;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(resetPasswordAction(values.password, token));
        navigate("/login");
      } catch (error) {
        message.error("Đổi mật khẩu thất bại!", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to right, #a1d6e2,rgb(132, 154, 158))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
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
          Đặt Lại Mật Khẩu
        </Typography.Title>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <Input.Password
            name="password"
            placeholder="Nhập mật khẩu mới"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={
              formik.touched.password && formik.errors.password ? "error" : ""
            }
            style={{
              height: 48,
              borderRadius: 10,
              fontSize: 16,
              borderColor: "#ccc",
              padding: "0 12px",
            }}
          />
          {formik.touched.password && formik.errors.password && (
            <Typography.Text type="danger">
              {formik.errors.password}
            </Typography.Text>
          )}
        </div>

        {/* Submit */}
          <ButtonCustom
            htmlType="submit"
            type="text"
            text="Đặt lại mật khẩu"
            block
          />
      </form>
    </div>
  );
};

export default ResetYourPassword;
