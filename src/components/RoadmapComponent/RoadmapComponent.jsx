import PropTypes from "prop-types";
import React from "react";
import "./RoadmapComponent.css";

export const RoadmapComponent = ({
  property1 = "default",
  className,
  text = "ROADMAP",
}) => {
  return (
    <div
      className={`roadmapcomponent-container roadmapcomponent-${property1} ${className}`}
    >
      <div className="roadmapcomponent-text">{text}</div>
    </div>
  );
};

RoadmapComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
  text: PropTypes.string,
  className: PropTypes.string,
};

export default RoadmapComponent;
