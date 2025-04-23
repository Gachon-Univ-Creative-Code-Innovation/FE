import PropTypes from "prop-types";
import React from "react";
import "./PortfolioComponent.css";

export const PortfolioComponent = ({ property1 = "default", className }) => {
  return (
    <div className={`portfolio portfolio-${property1} ${className}`}>
      <div className="portfolio-text">PORTFOLIO</div>
    </div>
  );
};

PortfolioComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
  className: PropTypes.string,
};

export default PortfolioComponent;
