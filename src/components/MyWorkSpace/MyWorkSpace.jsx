import PropTypes from "prop-types";
import React from "react";
import "./MyWorkSpace.css";

export const MyWorkSpace = ({ isActive, className, onClick }) => {
  return (
    <div
      className={`myworkspace-wrapper ${isActive ? "active" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="myworkspace-text">내 작업실</div>
    </div>
  );
};

MyWorkSpace.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default MyWorkSpace;
