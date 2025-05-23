import PropTypes from "prop-types";
import React from "react";
import "./MyWorkSpace.css";

export const MyWorkSpace = ({ property1, className }) => {
  return (
    <div className={`div-wrapper ${className}`}>
      <div className="text-wrapper-10">내 작업실</div>
    </div>
  );
};

MyWorkSpace.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default MyWorkSpace;
