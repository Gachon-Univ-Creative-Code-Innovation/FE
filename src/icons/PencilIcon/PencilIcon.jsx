import React from "react";

const PencilIcon = ({
  width = 24,
  height = 24,
  fill = "#1D1652",
  className = "",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M3 21H6.75L17.81 9.94L14.06 6.19L3 17.25V21ZM5 18.08L14.06 9.02L14.98 9.94L5.92 19H5V18.08Z"
      fill={fill}
    />
    <path
      d="M18.3709 3.29C17.9809 2.9 17.3509 2.9 16.9609 3.29L15.1309 5.12L18.8809 8.87L20.7109 7.04C21.1009 6.65 21.1009 6.02 20.7109 5.63L18.3709 3.29Z"
      fill={fill}
    />
  </svg>
);

export default PencilIcon;
