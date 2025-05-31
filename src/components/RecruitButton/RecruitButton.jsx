import PropTypes from "prop-types";
import React from "react";
import "./RecruitButton.css";

export const RecruitButton = ({ className, divClassName, onClick }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      <div className={`text-wrapper-9 ${divClassName}`}>모집하기</div>
    </button>
  );
};

RecruitButton.propTypes = {
  property1: PropTypes.oneOf(["default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default RecruitButton;
