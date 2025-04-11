import PropTypes from "prop-types";
import React from "react";
import "./Component4.css";

export const Component4 = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-4 property-1-4-${property1} ${className}`}>
      <div className={`text-wrapper-3 ${divClassName}`}>Feed</div>
    </div>
  );
};

Component4.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default Component4;
