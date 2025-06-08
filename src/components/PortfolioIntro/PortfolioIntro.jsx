import React from "react";
import { useNavigate } from "react-router-dom";
import "./PortfolioIntro.css";

const PortfolioIntro = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // 로그인 페이지로 이동하거나 로그인 모달 표시
    navigate("/login");
  };

  return (
    <div className="portfolio-intro-wrapper">
      <div className="portfolio-intro-container">
        <h2 className="portfolio-intro-title">
          AlOG가 만들어주는<br />
          <span className="highlight">스마트 포트폴리오</span>
        </h2>
        
        <button className="portfolio-intro-cta" onClick={handleLoginClick}>
          로그인하고 포트폴리오 만들기
        </button>
      </div>
    </div>
  );
};

export default PortfolioIntro; 