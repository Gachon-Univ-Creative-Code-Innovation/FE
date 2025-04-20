import React from "react";
import PropTypes from "prop-types";

const DownloadIcon = ({ size = 26, color = "white", className = "" }) => {
  return (
    <svg
      className={className}
      width={size * (20 / 26)}
      height={size}
      viewBox="0 0 20 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 25H19M10 1V19.6667M10 19.6667L17.5 13M10 19.6667L2.5 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

DownloadIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default DownloadIcon;
