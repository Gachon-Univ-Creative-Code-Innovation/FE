import PropTypes from "prop-types";
import React from "react";
import "./MakePortfolioCard.css";

export const MakePortfolio = ({ className, onClick }) => {
  return (
    <div
      className={`property-hover-wrapper ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <img className="img-front" src="/img/front-real.png" alt="front" />
      <img className="img-hover" src="/img/hover-real.png" alt="hover" />
    </div>
  );
};

MakePortfolio.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default MakePortfolio;
