import React from "react";

const MyPostPageIcon = ({
  width = "11",
  height = "16",
  stroke = "#A3B3BF",
  strokeWidth = 2,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 11 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 1.5L1 8L10 14.5"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MyPostPageIcon;
