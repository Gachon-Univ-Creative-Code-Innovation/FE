import PropTypes from "prop-types";
import React from "react";
import "./ExploreComponent.css";

export const ExploreComponent = ({ property1, className }) => {
  return (
    <div className={`explorecomponent-wrapper ${className}`}>
      <div className="explorecomponent-text">둘러보기</div>
    </div>
  );
};

ExploreComponent.propTypes = {
  property1: PropTypes.oneOf(["hover"]),
};

export default ExploreComponent;
