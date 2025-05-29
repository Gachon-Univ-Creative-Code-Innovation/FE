import React from "react";

const SortIcon = ({ className, onClick, strokeColor = "#A3B3BF" }) => {
  return (
    <svg
      className={className}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 16 12"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: "pointer", transition: "stroke 0.3s ease" }}
    >
      <path d="M1 11H9" />
      <path d="M1 6H15" />
      <path d="M1 1H9" />
    </svg>
  );
};

export default SortIcon;
