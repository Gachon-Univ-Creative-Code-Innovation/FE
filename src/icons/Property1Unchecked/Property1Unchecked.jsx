import PropTypes from "prop-types";
import React, { useState } from "react";
import "./Property1Unchecked.css"; //애니메이션 구현

export const Property1Unchecked = ({ className = "" }) => {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked((prev) => !prev);
  };

  return (
    <svg
      className={`property-1-unchecked ${className}`}
      fill="none"
      height="22"
      width="22"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <path
        d="M1 1H21V21H1V1Z"
        stroke="#1d1652"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className={`check-path ${checked ? "checked" : ""}`}
        d="M5.5 11L9.09988 15.3999C9.53822 15.9356 10.3752 15.8747 10.7313 15.2811L16 6.5"
        stroke="#1d1652"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

Property1Unchecked.propTypes = {
  className: PropTypes.string,
};

export default Property1Unchecked;
