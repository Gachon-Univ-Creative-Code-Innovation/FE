import PropTypes from "prop-types";
import React from "react";
import "./RoadmapComponent.css";

export const RoadmapComponent = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-9 property-1-${property1} ${className}`}>
      <div className={`text-wrapper-8 ${divClassName}`}>ROADMAP</div>
    </div>
  );
};

RoadmapComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
};

export default RoadmapComponent;
