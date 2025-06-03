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
      role: "BUYER",
    },
    validate: (values) => {
      const errors = {};
      if (!values.displayName)
        errors.displayName = "Vui lòng nhập tên tài khoản!";
      if (!values.password) errors.password = "Vui lòng nhập mật khẩu!";
      if (!values.email) errors.email = "Vui lòng nhập email!";
      if (!values.xacNhanMatKhau)
        errors.xacNhanMatKhau = "Vui lòng nhập lại mật khẩu!";
      else if (values.xacNhanMatKhau !== values.password)
        errors.xacNhanMatKhau = "Mật khẩu không khớp!";
      return errors;
    },
    onSubmit: async (values) => {
      const { xacNhanMatKhau, ...registerData } = values;
      try {
        await dispatch(registerAction(registerData));
        navigate("/login");
      } catch (error) {
        // đã xử lý lỗi ở trong action bằng message.error rồi
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
          Đăng ký người dùng
        </Typography.Title>

        {/* displayName */}
        <div className="mb-6">
          <Input
            name="displayName"
            placeholder="Tên tài khoản"
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
            placeholder="Mật khẩu"
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
            placeholder="Xác nhận mật khẩu"
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
        <ButtonCustom htmlType="submit" type="text" text="Đăng Nhập" block />

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text>
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#1890ff",
                fontWeight: 500,
              }}
            >
              Đăng nhập
            </Link>
          </Typography.Text>
        </div>
      </form>
    </div>
  );
}
