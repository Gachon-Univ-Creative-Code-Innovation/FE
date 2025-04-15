import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TabsGroup from "../../components/Tabs/TabsGroup";
import Component20 from "../../icons/Component20/Component20";
import Component18 from "../../icons/Component18/Component18";
import InterfaceTrashFull from "../../icons/InterfaceTrashFull/InterfaceTrashFull";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SelectModeScreen from "../SelectModeScreen/SelectModeScreen";
import "./Notice.css";

export const Notice = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const observer = useRef(null);
  const navigate = useNavigate();

  const tabs = ["All", "Unread", "Read"];
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const dummy = Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      content: `Notice ${i + 1}`,
      date: "2025.03.23",
      isRead: false,
    }));
    setNotifications(dummy);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedTab === "Unread") return !n.isRead;
    if (selectedTab === "Read") return n.isRead;
    return true;
  });

  const displayedNotifications = filteredNotifications.slice(
    0,
    page * ITEMS_PER_PAGE
  );

  const lastItemRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => {
            const nextStart = (prev + 1) * ITEMS_PER_PAGE;
            if (nextStart >= filteredNotifications.length) {
              setHasMore(false);
              return prev;
            }
            return prev + 1;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, filteredNotifications.length]
  );

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    setShowModal(false);
  };

  return (
    <PageTransitionWrapper>
      <Component18 className="component-18" />

      <div className="notice">
        <div className="div-6">
          <div className="post-list-4">
            <div className="frame-63">
              <div className="frame-64">
                <TabsGroup
                  tabs={tabs}
                  selected={selectedTab}
                  onSelect={(tab) => {
                    setSelectedTab(tab);
                    setPage(1);
                    setHasMore(true);
                  }}
                />
              </div>
              <div onClick={handleDeleteClick}>
                <InterfaceTrashFull className="interface-trash-full" />
              </div>
            </div>

            <div className="post-list-5">
              {displayedNotifications.map((notice, idx) => (
                <div
                  className="frame-65"
                  key={notice.id}
                  ref={
                    idx === displayedNotifications.length - 1
                      ? lastItemRef
                      : null
                  }
                  onClick={() => markAsRead(notice.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="comment-9">
                    <div
                      className={
                        notice.isRead ? "text-wrapper-77" : "text-wrapper-75"
                      }
                    >
                      {notice.content}
                    </div>
                  </div>
                  <div
                    className={
                      notice.isRead ? "text-wrapper-78" : "text-wrapper-76"
                    }
                  >
                    {notice.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="frame-66">
            <div className="component-wrapper">
              <Component20 className="component-63" />
            </div>
            <img
              className="alog-logo-6"
              alt="Alog logo"
              src="/img/alog-logo.png"
              onClick={() => navigate("/MainPagebefore")}
              style={{ cursor: "pointer" }}
            />
            <div className="frame-67"></div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="select-mode-screen__overlay">
          <SelectModeScreen
            onCancel={handleCancel}
            onDeleteAll={handleDeleteAll}
          />
        </div>
      )}
    </PageTransitionWrapper>
  );
};

export default Notice;
