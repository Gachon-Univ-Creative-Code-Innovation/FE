import PropTypes from "prop-types";
import React from "react";

export const Checked = ({ color = "#D9D9D9", className }) => {
  return (
    <svg
      className={`property-1-unchecked ${className}`}
      fill="none"
      height="22"
      viewBox="0 0 22 22"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M1 1H21V21H1V1Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="path"
        d="M5.5 11L9.09988 15.3999C9.53822 15.9356 10.3752 15.8747 10.7313 15.2811L16 6.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

Checked.propTypes = {
  color: PropTypes.string,
};

export default Checked;
