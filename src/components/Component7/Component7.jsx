import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component7 = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-7 property-1-8-${property1} ${className}`}>
      <div className={`text-wrapper-6 ${divClassName}`}>RESUME</div>
    </div>
  );
};

Component7.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
};

export default Component7;
