import PropTypes from "prop-types";
import React from "react";
import "./FeedComponent.css";

export const FeedComponent = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-4 property-1-4-${property1} ${className}`}>
      <div className={`text-wrapper-3 ${divClassName}`}>Feed</div>
    </div>
  );
};

FeedComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default FeedComponent;
