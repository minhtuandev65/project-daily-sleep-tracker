import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";
import "@testing-library/jest-dom";

describe("ButtonCustom", () => {
  it("renders with default props and text", () => {
    render(<ButtonCustom text="Click me" />);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btnCustom");
    expect(button).not.toBeDisabled();
  });

  it("renders with danger and disabled props", () => {
    render(<ButtonCustom text="Danger" danger disabled />);
    const button = screen.getByRole("button", { name: "Danger" });
    expect(button).toHaveAttribute("disabled");
    expect(button).toBeDisabled();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<ButtonCustom text="Click" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Click" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with custom className", () => {
    render(<ButtonCustom text="Custom" className="my-custom-class" />);
    const button = screen.getByRole("button", { name: "Custom" });
    expect(button).toHaveClass("btnCustom");
    expect(button).toHaveClass("my-custom-class");
  });

  it("renders with icon if provided", () => {
    const DummyIcon = <span data-testid="dummy-icon">🌟</span>;
    render(<ButtonCustom text="With Icon" icon={DummyIcon} />);
    expect(screen.getByTestId("dummy-icon")).toBeInTheDocument();
  });
});
