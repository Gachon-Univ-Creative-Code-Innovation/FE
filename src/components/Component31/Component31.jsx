import PropTypes from "prop-types";
import React from "react";
import "./Component31.css";

export const Component31 = ({ property1, className }) => {
  return (
    <div className={`component-31 property-1-${property1} ${className}`}>
      <div className="text-wrapper-19">Read</div>
    </div>
  );
};

Component31.propTypes = {
  property1: PropTypes.oneOf(["selected", "default"]),
};

export default Component31;
