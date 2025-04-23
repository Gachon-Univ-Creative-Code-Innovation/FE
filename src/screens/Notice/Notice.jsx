import React, { useState, useEffect, useRef, useCallback } from "react";
import TabsGroup from "../../components/AlarmTabs/TabsGroup";
import InterfaceTrashFull from "../../icons/InterfaceTrashFull/InterfaceTrashFull";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SelectModeScreen from "../SelectModeScreen/SelectModeScreen";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./Notice.css";

export const Notice = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const observer = useRef(null);
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
      <Navbar2 />
      <div className="notice">
        <div className="notice-div-6">
          <div className="notice-post-list-4">
            <div className="notice-frame-63">
              <div className="notice-frame-64">
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
                <InterfaceTrashFull className="notice-interface-trash-full" />
              </div>
            </div>

            <div className="notice-post-list-5">
              {displayedNotifications.map((notice, idx) => (
                <div
                  className="notice-frame-65"
                  key={notice.id}
                  ref={
                    idx === displayedNotifications.length - 1
                      ? lastItemRef
                      : null
                  }
                  onClick={() => markAsRead(notice.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="notice-comment-9">
                    <div
                      className={
                        notice.isRead
                          ? "notice-text-wrapper-77"
                          : "notice-text-wrapper-75"
                      }
                    >
                      {notice.content}
                    </div>
                  </div>
                  <div
                    className={
                      notice.isRead
                        ? "notice-text-wrapper-78"
                        : "notice-text-wrapper-76"
                    }
                  >
                    {notice.date}
                  </div>
                </div>
              ))}
            </div>
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
      <div className="notice-overlap-wrapper">
        <div className="notice-overlap">
          <ScrollUp className="notice-component-19" />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Notice;
