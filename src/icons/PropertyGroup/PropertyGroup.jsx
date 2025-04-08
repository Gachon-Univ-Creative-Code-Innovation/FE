import PropTypes from "prop-types";
import React from "react";

export const Property1Group3 = ({ color = "#A1A1A1", className }) => {
  return (
    <svg
      className={`property-1-group-3 ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
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

Property1Group3.propTypes = {
  color: PropTypes.string,
};

export default Property1Group3;
