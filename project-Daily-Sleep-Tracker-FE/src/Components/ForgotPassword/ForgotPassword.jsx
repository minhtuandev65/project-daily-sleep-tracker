import React from "react";
import { Input, Button, Typography, message } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { authServices } from "../../Services/Auth/AuthServices";
import ButtonCustom from "../ButtonCustom/ButtonCustom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Vui lòng nhập email!";
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await authServices.forgotPassword(values.email);
        message.success(
          "Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư đến của bạn."
        );
        navigate(`/login`);
      } catch {
        // lỗi xử lý trong action
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
          Quên Mật Khẩu
        </Typography.Title>

        {/* Email */}
        <div style={{ marginBottom: 24 }}>
          <Input
            name="email"
            placeholder="Nhập email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={formik.touched.email && formik.errors.email ? "error" : ""}
            style={{
              height: 48,
              borderRadius: 10,
              fontSize: 16,
              borderColor: "#ccc",
              padding: "0 12px",
            }}
          />
          {formik.touched.email && formik.errors.email && (
            <Typography.Text type="danger">
              {formik.errors.email}
            </Typography.Text>
          )}
        </div>

        {/* Submit */}
        <ButtonCustom
          htmlType="submit"
          type="text"
          text="Gửi Email khôi phục"
          block
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
