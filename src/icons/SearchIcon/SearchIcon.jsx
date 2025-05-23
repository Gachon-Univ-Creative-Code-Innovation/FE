import PropTypes from "prop-types";
import React from "react";

export const SearchIcon = ({ color = "#1d1652", className = "", style = {}, onClick }) => {
  return (
    <svg
      className={`search-icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      onClick={onClick}
    >
      <circle
        cx="11"
        cy="11"
        r="8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="16.65"
        y1="16.65"
        x2="21"
        y2="21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

SearchIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default SearchIcon;
