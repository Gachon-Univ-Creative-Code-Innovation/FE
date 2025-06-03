import PropTypes from "prop-types";
import React from "react";
import "./ComponentSeeAll.css";

export const ComponentSeeAll = ({ property1, className }) => {
  return (
    <div className={`seeall-container seeall-${property1} ${className}`}>
      <div className="seeall-text">See All</div>
    </div>
  );
};

ComponentSeeAll.propTypes = {
  property1: PropTypes.oneOf(["frame-20", "frame-19"]),
};

export default ComponentSeeAll;
