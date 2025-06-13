// src/Pages/ResetPassword/ResetYourPassword.jsx
import React from "react";
import { Input, Typography } from "antd";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "../../Redux/Actions/AuthAction/AuthAction";
const ResetYourPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");

  const formik = useFormik({
    initialValues: { password: "" },
    validate: (v) => {
      const e = {};
      if (!v.password) e.password = "Please enter new password!";
      else if (v.password.length < 6)
        e.password = "Password must be at least 6 characters!";
      return e;
    },
    onSubmit: async (values) => {
      try {
        const result = await dispatch(
          resetPasswordAction(values.password, token)
        );
        if (result?.payload?.success) {
          navigate("/login");
        }
      } catch (error) {
        // đã xử lý lỗi ở action
      }
    },
  });

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#a1d6e2] to-[#849a9e] flex justify-center items-center p-5">
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-[420px] p-8 md:p-10 rounded-[10px] shadow-xl"
      >
        <Typography.Title
          level={3}
          className="text-center mb-8 text-[22px] md:text-[24px]"
        >
          Reset your password
        </Typography.Title>

        {/* Password */}
        <div className="mb-6">
          <Input.Password
            name="password"
            placeholder="Enter new password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={
              formik.touched.password && formik.errors.password ? "error" : ""
            }
            className="h-[35px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
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
          text="Reset your password"
          block
        />
      </form>
    </div>
  );
};

export default ResetYourPassword;
