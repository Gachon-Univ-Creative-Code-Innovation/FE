import React from "react";
import PropTypes from "prop-types";

const ZoomInIcon = ({ size = 17, color = "#1D1652", className = "" }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 11L16 16M6.83333 12.6667C3.61167 12.6667 1 10.055 1 6.83333C1 3.61167 3.61167 1 6.83333 1C10.055 1 12.6667 3.61167 12.6667 6.83333C12.6667 10.055 10.055 12.6667 6.83333 12.6667Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

ZoomInIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default ZoomInIcon;
