// components/PortfolioCardList/PortfolioCardList.jsx
import React from "react";
import PropTypes from "prop-types";
import "./PortfolioCardList.css"; // 스타일 분리 시 필요

const PortfolioCardList = ({ data, page, itemsPerPage }) => {
  const startIndex = page * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="portfoliolist-wrapper">
      {currentData.map((item, index) => (
        <div className="portfoliolist-card" key={index}>
          <div className="portfoliolist-image-wrapper">
            <img
              src="/img/rectangle-142.png"
              alt={item.name}
              className="portfoliolist-image"
            />
            <div className="portfoliolist-overlay">
              <div className="portfoliolist-overlay-text">자세히 보기</div>
            </div>
          </div>
          <div className="portfoliolist-name">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

PortfolioCardList.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

export default PortfolioCardList;
