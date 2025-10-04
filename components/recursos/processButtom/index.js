import React from "react";
import "./style.sass";

export default function ProcessButton({
  type = "button",
  variant = "success", // success | warning | danger
  size = "md", // sm | md | lg
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`process-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
