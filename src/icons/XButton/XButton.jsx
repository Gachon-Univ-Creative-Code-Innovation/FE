import PropTypes from "prop-types";
import React from "react";

export const XButton = ({ color = "#A3B3BF", className = "", onClick }) => {
  return (
    <svg
      className={`x-button ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <path
        className="path"
        d="M4 21L21 4M21 21L4 4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

XButton.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default XButton;
