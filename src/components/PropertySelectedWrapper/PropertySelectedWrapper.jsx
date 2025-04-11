import PropTypes from "prop-types";
import React from "react";
import "./PropertySelectedWrapper.css";

export const PropertySelectedWrapper = ({ property1, className }) => {
  return (
    <div
      className={`property-selected-wrapper property-1-12-${property1} ${className}`}
    >
      <div className="text-wrapper-17">All</div>
    </div>
  );
};

PropertySelectedWrapper.propTypes = {
  property1: PropTypes.oneOf(["selected", "default"]),
};

export default PropertySelectedWrapper;
