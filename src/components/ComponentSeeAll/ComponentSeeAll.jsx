import PropTypes from "prop-types";
import React from "react";
import "./ComponentSeeAll.css";

export const ComponentSeeAll = ({ property1, className }) => {
  return (
    <div className={`component-17 property-1-0-${property1} ${className}`}>
      <div className="text-wrapper-14">See All</div>
    </div>
  );
};

ComponentSeeAll.propTypes = {
  property1: PropTypes.oneOf(["frame-20", "frame-19"]),
};

export default ComponentSeeAll;
