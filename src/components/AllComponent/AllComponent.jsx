import PropTypes from "prop-types";
import React from "react";
import "./AllComponent.css";

export const AllComponent = ({ property1, className, divClassName }) => {
  return (
    <div
      className={`property-default-wrapper property-1-0-${property1} ${className}`}
    >
      <div className={`div ${divClassName}`}>All</div>
    </div>
  );
};

AllComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default AllComponent;
