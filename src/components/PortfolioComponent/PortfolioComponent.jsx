import PropTypes from "prop-types";
import React from "react";
import "./PortfolioComponent.css";

export const PortfolioComponent = ({
  property1 = "default",
  className,
  onClick,
}) => {
  return (
    <div
      className={`portfolio portfolio-${property1} ${className}`}
      onClick={onClick}
    >
      <div className="portfolio-text">PORTFOLIO</div>
    </div>
  );
};

PortfolioComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default PortfolioComponent;
