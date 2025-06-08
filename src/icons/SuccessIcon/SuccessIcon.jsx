import React from "react";

export const SuccessIcon = ({ 
  size = 48, 
  color = "#1d1652", 
  className = "",
  strokeColor = "white",
  strokeWidth = 3
}) => {
  return (
    <svg
      className={`success-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        cx="24" 
        cy="24" 
        r="20" 
        fill={color} 
        stroke={color} 
        strokeWidth="2"
      />
      <path
        d="M16 24L21 29L32 18"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SuccessIcon; 