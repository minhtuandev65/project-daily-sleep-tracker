// components/ButtonCustom.jsx
import React from "react";
import { Button } from "antd";
import "./ButtonCustom.css"; // Nếu muốn style riêng ngoài Tailwind hoặc Ant

const ButtonCustom = ({
  text,
  type = "primary",
  icon,
  onClick,
  danger = false,
  disabled = false,
  htmlType = "button",
  className = "",
  ...rest
}) => {
  return (
    <Button
      type={type}
      icon={icon}
      danger={danger}
      disabled={disabled}
      onClick={onClick}
      className={`btnCustom ${className}`.trim()}
      htmlType={htmlType}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default ButtonCustom;
