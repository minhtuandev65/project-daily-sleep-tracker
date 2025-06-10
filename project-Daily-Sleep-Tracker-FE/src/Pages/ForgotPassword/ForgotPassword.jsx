import React from "react";
import { Input, Typography } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";
import { forgotPasswordAction } from "../../Redux/Actions/AuthAction/AuthAction";
import { emailRegex } from "../../Utils/Validators/regex";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChangeWithTouch = (e) => {
    const { name, value } = e.target;
    formik.setFieldTouched(name, true); // Đánh dấu là đã chạm vào
    formik.setFieldValue(name, value); // Cập nhật giá trị
  };
  const formik = useFormik({
    initialValues: { email: "" },
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
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await dispatch(forgotPasswordAction(values.email, navigate));
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
          Forgot password
        </Typography.Title>

        {/* Email */}
        <div className="mb-6">
          {formik.touched.email && formik.errors.email && (
            <Typography.Text type="danger" className="text-sm sm:text-xs">
              {formik.errors.email}
            </Typography.Text>
          )}
          <Input
            name="email"
            placeholder="useremail@example.com"
            value={formik.values.email}
            onChange={handleChangeWithTouch}
            status={formik.touched.email && formik.errors.email ? "error" : ""}
            className="h-[35px] md:h-[40px] lg:h-[48px] rounded-[10px] text-base md:text-lg px-3 border border-gray-300"
          />
        </div>

        {/* Submit */}
        <ButtonCustom
          htmlType="submit"
          type="text"
          text="Send Recovery Email"
          block
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
