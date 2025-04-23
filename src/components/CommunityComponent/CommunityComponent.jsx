import PropTypes from "prop-types";
import React from "react";
import "./CommunityComponent.css";

export const CommunityComponent = ({ property1, className }) => {
  return (
    <div className={`community ${className}`}>
      <div className="text-wrapper-2">COMMUNITY</div>
    </div>
  );
};

CommunityComponent.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default CommunityComponent;
