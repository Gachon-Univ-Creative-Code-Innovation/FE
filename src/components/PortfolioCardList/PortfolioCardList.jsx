import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioIntro from "../PortfolioIntro/PortfolioIntro";
import "./PortfolioCardList.css";
const MotionDiv = motion.div;

const PortfolioCardList = ({ data, page, itemsPerPage, showIntro = false }) => {
  const startIndex = page * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  // 데이터가 없고 소개를 보여달라고 요청된 경우
  if (data.length === 0 && showIntro) {
    return <PortfolioIntro />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${page}-${data.length}`}
        className="portfoliolist-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {currentData.map((item, index) => (
          <div className="portfoliolist-card" key={index}>
            <div className="portfoliolist-image-wrapper">
              <img
                src={item.image}
                alt={item.title}
                className="portfoliolist-image"
              />
              <div
                className="portfoliolist-overlay"
                onClick={() => window.location.href = `/portfolio/view/:${item.portfolio_id}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="portfoliolist-overlay-text">자세히 보기</div>
              </div>
            </div>
            <div className="portfoliolist-name">{item.title}</div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

PortfolioCardList.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  showIntro: PropTypes.bool,
};

export default PortfolioCardList;
