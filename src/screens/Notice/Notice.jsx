import React, { useState, useEffect } from "react";
import TabsGroup from "../../components/AlarmTabs/TabsGroup";
import InterfaceTrashFull from "../../icons/InterfaceTrashFull/InterfaceTrashFull";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SelectModeScreen from "../SelectModeScreen/SelectModeScreen";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./Notice.css";
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api/alarm-service",
});

// 알림 아이템 컴포넌트
function NotificationItem({ notice, onClick, onMenuOpen, menuOpen, onMarkAsRead, onDelete }) {
  return (
    <div
      className="notice-frame-65"
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      key={notice.id}
    >
      <div
        onClick={() => onClick(notice)}
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
            onMenuOpen(notice.id);
          }}
        >
          ⋯
        </button>
        {menuOpen === notice.id && (
          <div className="notice-popover-menu">
            <button
              className="notice-popover-item"
              onClick={async (e) => {
                e.stopPropagation();
                await onMarkAsRead(notice.id);
                onMenuOpen(null);
              }}
            >
              읽음 처리
            </button>
            <button
              className="notice-popover-item danger"
              onClick={async (e) => {
                e.stopPropagation();
                await onDelete(notice.id);
                onMenuOpen(null);
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const Notice = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 페이지네이션 그룹화
  const [pageGroup, setPageGroup] = useState(0); // 0: 1~10, 1: 11~20 ...
  const PAGE_GROUP_SIZE = 10;

  // API 호출 통합
  const fetchNotifications = async (tab = "All", pageNum = 0) => {
    const token = localStorage.getItem("jwtToken");
    let url = "/notifications";
    if (tab === "Unread") url += "/unread";
    else if (tab === "Read") url += "/read";
    try {
      const res = await api.get(`${url}?page=${pageNum}&size=${ITEMS_PER_PAGE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data.content);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      setNotifications([]);
      setTotalPages(1);
      console.error("알림 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchNotifications(selectedTab, page);
  }, [selectedTab, page]);

  // 탭 변경 시 페이지 그룹도 0으로 초기화
  useEffect(() => {
    setPageGroup(0);
    setPage(0);
  }, [selectedTab]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      fetchNotifications(selectedTab, page);
    } catch (err) {
      console.error("알림 읽음 처리 실패:", err);
    }
  };

  const handleDeleteOne = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("특정 알림 삭제 실패:", err);
    }
  };

  const handleNoticeClick = (notice) => {
    // TODO: 상세 페이지 이동 등 구현 예정
  };

  const handleDeleteClick = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.delete("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      setShowModal(false);
    } catch (err) {
      console.error("전체 알림 삭제 실패:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.patch("/notifications/read/all", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("전체 알림 읽음 처리 실패:", err);
    }
  };

  // 페이지네이션 그룹 계산
  const startPage = pageGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);
  const canPrevGroup = pageGroup > 0;
  const canNextGroup = endPage < totalPages;

  return (
    <PageTransitionWrapper>
      <Navbar2 />
      <div className="notice">
        <div className="notice-div-6">
          <div className="notice-post-list-4">
            <div className="notice-frame-63">
              <div className="notice-frame-64">
                <TabsGroup
                  tabs={["All", "Unread", "Read"]}
                  selected={selectedTab}
                  onSelect={(tab) => setSelectedTab(tab)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="notice-shark-btn" onClick={handleMarkAllRead}>
                  <img src="/img/strong-shark.png" alt="전체 읽음" />
                </button>
                <div onClick={handleDeleteClick}>
                  <InterfaceTrashFull className="notice-interface-trash-full" />
                </div>
              </div>
            </div>
            <div className="notice-post-list-5">
              {notifications.map((notice) => (
                <NotificationItem
                  key={notice.id}
                  notice={notice}
                  onClick={handleNoticeClick}
                  onMenuOpen={setMenuOpenId}
                  menuOpen={menuOpenId}
                  onMarkAsRead={markAsRead}
                  onDelete={handleDeleteOne}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="select-mode-screen__overlay">
          <SelectModeScreen onCancel={handleCancel} onDeleteAll={handleDeleteAll} />
        </div>
      )}
      <div className="notice-overlap-wrapper">
        <div className="notice-overlap">
          <ScrollUp className="notice-component-19" />
        </div>
      </div>
      {/* 페이지네이션 UI */}
      <div className="notice-pagination">
        <button
          className="notice-pagination-arrow"
          disabled={page === 0}
          onClick={() => {
            if (page === startPage) {
              if (canPrevGroup) {
                setPageGroup(pageGroup - 1);
                setPage((pageGroup - 1) * PAGE_GROUP_SIZE + PAGE_GROUP_SIZE - 1);
              }
            } else {
              setPage(page - 1);
            }
          }}
        >
          &#60;
        </button>
        {Array.from({ length: endPage - startPage }).map((_, idx) => (
          <button
            key={startPage + idx}
            className={`notice-pagination-btn${page === startPage + idx ? " active" : ""}`}
            onClick={() => setPage(startPage + idx)}
            disabled={page === startPage + idx}
          >
            {startPage + idx + 1}
          </button>
        ))}
        <button
          className="notice-pagination-arrow"
          disabled={page === totalPages - 1}
          onClick={() => {
            if (page === endPage - 1) {
              if (canNextGroup) {
                setPageGroup(pageGroup + 1);
                setPage((pageGroup + 1) * PAGE_GROUP_SIZE);
              }
            } else {
              setPage(page + 1);
            }
          }}
        >
          &#62;
        </button>
      </div>
    </PageTransitionWrapper>
  );
};

export default Notice;
