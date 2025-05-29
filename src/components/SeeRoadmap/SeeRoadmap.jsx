import PropTypes from "prop-types";
import React from "react";
import "./SeeRoadmap.css";

export const SeeRoadmap = ({ property1, className }) => {
  const stateClass = property1 === "selected" ? "selected" : "default";

  return (
    <div className={`seeroadmap-button ${stateClass} ${className}`}>
      <div className="seeroadmap-frame">
        <div className="seeroadmap-text">둘러보기</div>
      </div>
    </div>
  );
};

SeeRoadmap.propTypes = {
  property1: PropTypes.oneOf(["default", "selected"]),
  className: PropTypes.string,
};

export default SeeRoadmap;
