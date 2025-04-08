import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component8 = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-8 ${property1} ${className}`}>
      <div className={`text-wrapper-7 ${divClassName}`}>PORTFOLIO</div>
    </div>
  );
};

Component8.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default Component8;
