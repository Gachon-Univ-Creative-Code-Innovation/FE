import PropTypes from "prop-types";
import React from "react";
import "./PropertySeeAll.css";

export const PropertySeeAll = ({ property1, className }) => {
  return (
    <div className={`property-frame-wrapper ${property1} ${className}`}>
      <div className="div">See All</div>
    </div>
  );
};

PropertySeeAll.propTypes = {
  property1: PropTypes.oneOf(["frame-20"]),
  className: PropTypes.string,
};

export default PropertySeeAll;
