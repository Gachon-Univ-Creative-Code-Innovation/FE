// src/components/MakePortfolio.jsx
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MakePortfolioCard.css";

export const MakePortfolio = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/portfolio");
  };

  return (
    <div
      className={`property-hover-wrapper ${className}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img className="img-front" src="/img/portfolio_new.png" alt="front" />

      {/* 별 요소 (중심 회전) */}
      <div className="sparkle-extra orbit1"></div>
      <div className="sparkle-extra orbit2"></div>
      <div className="sparkle-extra orbit3"></div>
      <div className="sparkle-extra orbit4"></div>
    </div>
  );
};

MakePortfolio.propTypes = {
  className: PropTypes.string,
};

export default MakePortfolio;