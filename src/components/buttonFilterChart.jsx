import React from "react";

export const ButtonFilterChart = ({
  onClick,
  disabled,
  isActive,
  isConditionMet,
  className,
  children,
}) => {
  let computedClassName = className;

  if (isActive) {
    computedClassName = "bg-primary text-white";
  } else if (!disabled && isConditionMet) {
    computedClassName = "border border-primary text-black";
  } else {
    computedClassName = "border border-dark text-gray";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || !isConditionMet}
      className={`btn ${computedClassName} ${isActive ? "active" : ""}`}
    >
      {children}
    </button>
  );
};