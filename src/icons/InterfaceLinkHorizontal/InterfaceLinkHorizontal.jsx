import React from "react";

export const InterfaceLinkHorizontal = ({ className }) => {
  return (
    <svg
      className={`interface-link-horizontal ${className}`}
      fill="none"
      height="30"
      viewBox="0 0 30 30"
      width="30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M10 15H20M18.75 10H21.25C24.0114 10 26.25 12.2386 26.25 15C26.25 17.7614 24.0114 20 21.25 20H18.75M11.25 10H8.75C5.98858 10 3.75 12.2386 3.75 15C3.75 17.7614 5.98858 20 8.75 20H11.25"
        stroke="#1D1652"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default InterfaceLinkHorizontal;
