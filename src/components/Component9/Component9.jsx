import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component9 = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-9 property-1-${property1} ${className}`}>
      <div className={`text-wrapper-8 ${divClassName}`}>ROADMAP</div>
    </div>
  );
};

Component9.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
};

export default Component9;
