import PropTypes from "prop-types";
import React from "react";
import "./PropertyFrameWrapper.css";

export const PropertyFrameWrapper = ({ property1 }) => {
  return (
    <div className={`property-frame-wrapper ${property1}`}>
      <div className="text-wrapper-5">MY BLOG</div>
    </div>
  );
};

PropertyFrameWrapper.propTypes = {
  property1: PropTypes.oneOf(["frame-117", "frame-118"]),
};

export default PropertyFrameWrapper;
