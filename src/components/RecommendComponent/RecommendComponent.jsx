import PropTypes from "prop-types";
import React from "react";
import "./RecommendComponent.css";

export const RecomendComponent = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-5 property-1-6-${property1} ${className}`}>
      <div className={`text-wrapper-4 ${divClassName}`}>Recommend</div>
    </div>
  );
};

RecomendComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default RecomendComponent;
