import PropTypes from "prop-types";
import React from "react";
import "./PortfolioComponent.css";

export const PortfolioComponent = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-8 ${property1} ${className}`}>
      <div className={`text-wrapper-7 ${divClassName}`}>PORTFOLIO</div>
    </div>
  );
};

PortfolioComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default PortfolioComponent;
