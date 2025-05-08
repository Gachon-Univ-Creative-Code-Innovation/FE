import React, { useState, useEffect, useRef, useCallback } from "react";
import TabsGroup from "../../components/AlarmTabs/TabsGroup";
import InterfaceTrashFull from "../../icons/InterfaceTrashFull/InterfaceTrashFull";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SelectModeScreen from "../SelectModeScreen/SelectModeScreen";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./Notice.css";
import axios from "axios";

export const Notice = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const observer = useRef(null);
  const tabs = ["All", "Unread", "Read"];
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get("http://localhost:8080/api/alarm-service/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data.content);
    } catch (err) {
      console.error("전체 알림 불러오기 실패:", err);
    }
  };

  const fetchUnreadNotifications = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get("http://localhost:8080/api/alarm-service/notifications/unread", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data.content);
    } catch (err) {
      console.error("안 읽은 알림 불러오기 실패:", err);
    }
  };

  const fetchReadNotifications = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get("http://localhost:8080/api/alarm-service/notifications/read", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data.content);
    } catch (err) {
      console.error("읽은 알림 불러오기 실패:", err);
    }
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.patch(
        `http://localhost:8080/api/alarm-service/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("알림 읽음 처리 실패:", err);
    }
  };

  const handleDeleteOne = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.delete(`http://localhost:8080/api/alarm-service/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("특정 알림 삭제 실패:", err);
    }
  };

  const handleNoticeClick = (notice) => {
    // TODO: 상세 페이지 이동 등 구현 예정
    // 예: navigate(`/notice/${notice.id}`);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedTab === "Unread") return !n.read;
    if (selectedTab === "Read") return n.read;
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

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.delete("http://localhost:8080/api/alarm-service/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
      setShowModal(false);
    } catch (err) {
      console.error("전체 알림 삭제 실패:", err);
    }
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
                  onSelect={async (tab) => {
                    setSelectedTab(tab);
                    setPage(1);
                    setHasMore(true);

                    if (tab === "All") {
                      // 전체 알림 불러오기 함수 호출
                      fetchAllNotifications();
                    } else if (tab === "Unread") {
                      // 안 읽은 알림 불러오기 함수 호출
                      fetchUnreadNotifications();
                    } else if (tab === "Read") {
                      // 읽은 알림 불러오기 함수 호출
                      fetchReadNotifications();
                    }
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
                  ref={idx === displayedNotifications.length - 1 ? lastItemRef : null}
                  style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div
                    onClick={() => handleNoticeClick(notice)}
                    style={{ flex: 1, cursor: "pointer" }}
                  >
                    <div className={notice.read ? "notice-text-wrapper-77" : "notice-text-wrapper-75"}>
                      {notice.content}
                    </div>
                    <div className={notice.read ? "notice-text-wrapper-78" : "notice-text-wrapper-76"}>
                      {notice.date}
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <button
                      className="notice-more-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === notice.id ? null : notice.id);
                      }}
                    >
                      ⋯
                    </button>
                    {menuOpenId === notice.id && (
                      <div className="notice-popover-menu">
                        <button
                          className="notice-popover-item"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await markAsRead(notice.id);
                            setMenuOpenId(null);
                          }}
                        >
                          읽음 처리
                        </button>
                        <button
                          className="notice-popover-item danger"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleDeleteOne(notice.id);
                            setMenuOpenId(null);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
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
