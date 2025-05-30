import React from "react";

const ArrowRightIcon = ({
  className = "",
  style = {},
  stroke = "#A3B3BF", // ✅ 기본값 지정
}) => {
  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M1.5 1.5L10.5 8L1.5 14.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowRightIcon;
