import PropTypes from "prop-types";
import React from "react";
import "./UnfollowComponent.css";

export const UnfollowComponent = ({ property1, className }) => {
  return (
    <div className={`component-28 property-1-${property1} ${className}`}>
      <div className="text-wrapper-4">Unfollow</div>
    </div>
  );
};

UnfollowComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default UnfollowComponent;
