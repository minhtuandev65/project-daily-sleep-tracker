// components/ButtonEntry.jsx
import React from "react";
import { Button } from "antd";
import "./ButtonEntry.css";

const ButtonEntry = ({
  text,
  type = "primary",
  icon,
  onClick,
  danger = false,
  disabled = false,
  htmlType = "button",
  ...rest
}) => {
  return (
    <Button
      type={type}
      icon={icon}
      danger={danger}
      disabled={disabled}
      onClick={onClick}
      className={"btnEntry"}
      htmlType={htmlType}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default ButtonEntry;
