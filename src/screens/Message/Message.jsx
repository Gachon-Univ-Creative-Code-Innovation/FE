import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar2 from "../../components/Navbar2/Navbar2";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./Message.css";

export const Message = () => {
  const ITEMS_PER_PAGE = 10;

  const [allData, setAllData] = useState([]);
  const [dummyList, setDummyList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  useEffect(() => {
    const dummy = Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      nickname: `쪼꼬`,
      message: `내일 뭐해?`,
      date: "2025.05.05",
      img: "/img/ellipse-12-12.png",
    }));
    setAllData(dummy);
  }, []);

  useEffect(() => {
    if (allData.length === 0) return;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newData = allData.slice(start, end);

    if (newData.length === 0) {
      setHasMore(false);
      return;
    }

    setDummyList((prev) => [...prev, ...newData]);
  }, [page, allData]);

  const lastItemRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <PageTransitionWrapper>
      <div className="message-screen">
        <Navbar2 />
        <div className="message-container">
          <div className="message-post-list">
            {dummyList.map((item, idx) => (
              <div
                className="message-item"
                key={item.id}
                ref={idx === dummyList.length - 1 ? lastItemRef : null}
              >
                <div className="message-profile">
                  <img
                    className="message-avatar"
                    alt="profile"
                    src={item.img}
                  />
                </div>
                <div className="message-content">
                  <div className="message-nickname">{item.nickname}</div>
                  <div className="message-text">{item.message}</div>
                </div>
                <div className="message-date-wrapper">
                  <div className="message-date">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Message;
