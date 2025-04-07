import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component5 = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-5 property-1-6-${property1} ${className}`}>
      <div className={`text-wrapper-4 ${divClassName}`}>Recommend</div>
    </div>
  );
};

Component5.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default Component5;
