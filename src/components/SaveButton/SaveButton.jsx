import PropTypes from "prop-types";
import React from "react";
import "./SaveButton.css";

export const SaveButton = ({ property1, className, divClassName, onClick }) => {
  return (
    <div className={`save-button ${className}`} onClick={onClick}>
      <div className={`text-wrapper ${divClassName}`}>저장</div>
    </div>
  );
};

SaveButton.propTypes = {
  property1: PropTypes.oneOf(["active"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default SaveButton;
