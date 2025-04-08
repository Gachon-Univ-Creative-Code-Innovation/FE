import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component3 = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-3 property-1-2-${property1} ${className}`}>
      <div className={`text-wrapper-2 ${divClassName}`}>Category</div>
    </div>
  );
};

Component3.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default Component3;
