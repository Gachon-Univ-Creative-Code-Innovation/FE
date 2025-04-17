import PropTypes from "prop-types";
import React from "react";
import "./ResumeComponent.css";

export const ResumeComponent = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-7 property-1-8-${property1} ${className}`}>
      <div className={`text-wrapper-6 ${divClassName}`}>RESUME</div>
    </div>
  );
};

ResumeComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
};

export default ResumeComponent;
