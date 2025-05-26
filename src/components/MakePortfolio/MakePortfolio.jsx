import React from "react";
import ArrowRightIcon from "../../icons/ArrowRightIcon/ArrowRightIcon"; // 경로 확인
import "./MakePortfolio.css";

export const MakePortfolio = () => {
  return (
    <div className="makeportfolio-frame">
      <div className="makeportfolio-left">
        <p className="makeportfolio-title">
          <span className="makeportfolio-title-logo">AlOG</span>
          <span className="makeportfolio-title-desc">
            로 편리하게 포트폴리오 만들기
          </span>
        </p>

        <p className="makeportfolio-subtitle">
          <span className="makeportfolio-subtext">
            레포지토리 주소만 입력하면
          </span>
          <span className="makeportfolio-logo-bold">AlOG</span>
          <span className="makeportfolio-subtext">
            가 자동으로 초안을 생성해 줘요!
          </span>
        </p>
      </div>

      <div className="makeportfolio-button">
        <div className="makeportfolio-button-text">포트폴리오 만들기</div>
        <ArrowRightIcon className="makeportfolio-vector" stroke="#1d1652" />
      </div>
    </div>
  );
};

export default MakePortfolio;
