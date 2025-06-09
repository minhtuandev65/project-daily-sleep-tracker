import React from "react";
import { Input, Typography } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";
import { forgotPasswordAction } from "../../Redux/Actions/AuthAction/AuthAction";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Please enter your email!";
      return errors;
    },
    onSubmit: async (values, dispatch) => {
      try {
        await dispatch(forgotPasswordAction(values.email));
        navigate(`/login`);
      } catch {
        //  đã xử lý lỗi ở action
      }
    },
  });

  return (
    <div className="h-screen bg-gradient-to-r from-[#a1d6e2] to-[#849a9e] flex justify-center items-center p-5">
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-[420px] p-8 md:p-10 rounded-[10px] shadow-xl"
      >
        <Typography.Title
          level={3}
          className="text-center mb-8 text-[22px] md:text-[24px]"
        >
          Quên Mật Khẩu
        </Typography.Title>

        {/* Email */}
        <div className="mb-6">
          <Input
            name="email"
            placeholder="Nhập email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={formik.touched.email && formik.errors.email ? "error" : ""}
            className="h-[35px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
          {formik.touched.email && formik.errors.email && (
            <Typography.Text type="danger" className="text-sm sm:text-xs">
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
