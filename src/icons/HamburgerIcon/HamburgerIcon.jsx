import React from "react";
import PropTypes from "prop-types";

const HamburgerIcon = ({
  width = 26,
  height = 16,
  stroke = "#1D1652",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 26 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 14.5H25M1 8H25M1 1.5H25"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

HamburgerIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.string,
  className: PropTypes.string,
};

export default HamburgerIcon;
