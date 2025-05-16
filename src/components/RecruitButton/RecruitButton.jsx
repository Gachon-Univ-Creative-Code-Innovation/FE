import PropTypes from "prop-types";
import React from "react";
import "./RecruitButton.css";

export const RecruitButton = ({ className, divClassName }) => {
  return (
    <button className={`btn ${className}`}>
      <div className={`text-wrapper-9 ${divClassName}`}>모집하기</div>
    </button>
  );
};

RecruitButton.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default RecruitButton;
