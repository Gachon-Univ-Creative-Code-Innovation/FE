import PropTypes from "prop-types";
import React from "react";
import "./PropertyDefaultWrapper.css";

export const PropertyDefaultWrapper = ({
  property1,
  className,
  divClassName,
}) => {
  return (
    <div
      className={`property-default-wrapper property-1-0-${property1} ${className}`}
    >
      <div className={`div ${divClassName}`}>All</div>
    </div>
  );
};

PropertyDefaultWrapper.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default PropertyDefaultWrapper;
