import PropTypes from "prop-types";
import React from "react";
import "./GoPortfolio.css";

export const GoPortfolio = ({ className }) => {
  return (
    <div className={`property-default-wrapper ${className}`}>
      <div className="text-wrapper">포트폴리오</div>
    </div>
  );
};

GoPortfolio.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default GoPortfolio;
