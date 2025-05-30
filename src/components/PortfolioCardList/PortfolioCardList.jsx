import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import "./PortfolioCardList.css";
const MotionDiv = motion.div;

const PortfolioCardList = ({ data, page, itemsPerPage }) => {
  const startIndex = page * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${page}-${data.length}`} // 페이지/데이터 변경에 따른 재렌더링 유도
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
      </motion.div>
    </AnimatePresence>
  );
};

PortfolioCardList.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

export default PortfolioCardList;
