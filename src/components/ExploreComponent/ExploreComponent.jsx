import PropTypes from "prop-types";
import React from "react";
import "./ExploreComponent.css";

export const ExploreComponent = ({ isActive, className, onClick }) => {
  return (
    <div
      className={`explorecomponent-wrapper ${
        isActive ? "active" : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="explorecomponent-text">둘러보기</div>
    </div>
  );
};

ExploreComponent.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ExploreComponent;
