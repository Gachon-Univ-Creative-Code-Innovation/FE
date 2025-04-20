import React, { useRef, useEffect, useCallback } from "react";
import ZoomInIcon from "../../icons/ZoomInIcon/ZoomInIcon";
import "./HistoryList.css";

const HistoryList = ({ items, onPreview }) => {
  return (
    <div className="historylist">
      {items.map((item, index) => (
        <HistoryListItem
          key={index}
          url={item.url}
          blocks={item.blocks || []}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

const HistoryListItem = ({ url, blocks, onPreview }) => {
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el && el.scrollLeft + el.clientWidth >= el.scrollWidth - 50) {
      // 필요시 여기에 자동 로딩 로직 추가
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="historylist-card">
      <div className="historylist-repo-header">
        <div className="historylist-repo-label">Repository</div>
        <div className="historylist-repo-url">{url}</div>
      </div>
      <div className="historylist-scroll-wrapper" ref={scrollRef}>
        <div className="historylist-scroll">
          {blocks.map((block, i) => (
            <div
              key={i}
              className="historylist-readme-block"
              onClick={() => onPreview?.(url, block.image)}
            >
              <img
                src={block.image}
                alt={`readme-preview-${i}`}
                className="historylist-preview-image"
              />
              <ZoomInIcon className="zoom-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
