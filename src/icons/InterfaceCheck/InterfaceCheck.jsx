import React from "react";

export const InterfaceCheck = ({ className }) => {
  return (
    <svg
      className={`interface-check ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M6 12L10.2426 16.2426L18.727 7.75732"
        stroke="#1D1652"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default InterfaceCheck;
