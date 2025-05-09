import React from "react";
import "./CloseIcon.css";

export const CloseIcon = ({ className, onClick }) => {
  return (
    <div className={`close-icon ${className}`} onClick={onClick}>
      <svg
        className="vector"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 6L18 18"
          stroke="#A3B3BF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 18L18 6"
          stroke="#A3B3BF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CloseIcon;
