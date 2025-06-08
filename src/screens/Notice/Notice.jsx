import React, { useState, useEffect, useRef } from "react";
import TabsGroup from "../../components/AlarmTabs/TabsGroup";
import InterfaceTrashFull from "../../icons/InterfaceTrashFull/InterfaceTrashFull";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import DeleteNotice from "../DeleteNotice/DeleteNotice";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./Notice.css";
import api from "../../api/instance";

function NotificationItem({
  notice,
  onClick,
  onMenuOpen,
  menuOpen,
  onMarkAsRead,
  onDelete,
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (menuOpen !== notice.id) return;
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, notice.id, onMenuOpen]);

  return (
    <div
      className="notice-frame-65"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      key={notice.id}
    >
      <div
        onClick={() => onClick(notice)}
        style={{ flex: 1, cursor: "pointer" }}
      >
        <div
          className={
            notice.read ? "notice-text-wrapper-77" : "notice-text-wrapper-75"
          }
        >
          {notice.content}
        </div>
        <div
          className={
            notice.read ? "notice-text-wrapper-78" : "notice-text-wrapper-76"
          }
        >
          {notice.date}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <button
          className="notice-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMenuOpen(menuOpen === notice.id ? null : notice.id);
          }}
        >
          ⋯
        </button>
        {menuOpen === notice.id && (
          <div className="notice-popover-menu" ref={popoverRef}>
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

// 알림 타입에 따라 이동할 링크 생성 함수
function getAlarmLink(notice) {
  const baseUrl = window.location.origin; // 환경에 따라 자동 결정
  if (["COMMENT", "REPLY", "POST"].includes(notice.type)) {
    return `${baseUrl}/viewpost/${notice.targetUrl}`;
  }
  if (notice.type === "FOLLOW") {
    return `${baseUrl}/blog/${notice.targetUrl}`;
  }
  return null;
}

export const Notice = () => {
  const [selectedTab, setSelectedTab] = useState("전체");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [pageGroup, setPageGroup] = useState(0);
  const PAGE_GROUP_SIZE = 10;

  const fetchNotifications = async (tab = "전체", pageNum = 0) => {
    const token = localStorage.getItem("jwtToken");
    let url = "alarm-service/notifications";
    if (tab === "안읽음") url += "/unread";
    else if (tab === "읽음") url += "/read";
    try {
      const res = await api.get(
        `${url}?page=${pageNum}&size=${ITEMS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  useEffect(() => {
    setPageGroup(0);
    setPage(0);
  }, [selectedTab]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.patch(
        `alarm-service/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications(selectedTab, page);
    } catch (err) {
      console.error("알림 읽음 처리 실패:", err);
    }
  };

  const handleDeleteOne = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.delete(`alarm-service/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("특정 알림 삭제 실패:", err);
    }
  };

  const handleDeleteClick = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      await api.delete("alarm-service/notifications", {
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
      await api.patch(
        "alarm-service/notifications/read/all",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("전체 알림 읽음 처리 실패:", err);
    }
  };

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
                  tabs={["전체", "안읽음", "읽음"]}
                  selected={selectedTab}
                  onSelect={(tab) => setSelectedTab(tab)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* ✅ 이미지 대신 텍스트 버튼 */}
                <button
                  className="notice-shark-btn"
                  onClick={handleMarkAllRead}
                >
                  전체 읽음
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
                  onMenuOpen={setMenuOpenId}
                  menuOpen={menuOpenId}
                  onMarkAsRead={markAsRead}
                  onDelete={handleDeleteOne}
                  onClick={async (notice) => {
                    await markAsRead(notice.id);
                    const url = getAlarmLink(notice);
                    if (url) window.open(url, "_blank");
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="select-mode-screen__overlay">
          <DeleteNotice onCancel={handleCancel} onDeleteAll={handleDeleteAll} />
        </div>
      )}
      <div className="notice-overlap-wrapper">
        <div className="notice-overlap">
          <ScrollUp className="notice-component-19" />
        </div>
      </div>
      <div className="notice-pagination">
        <button
          className="notice-pagination-arrow"
          disabled={page === 0}
          onClick={() => {
            if (page === startPage) {
              if (canPrevGroup) {
                setPageGroup(pageGroup - 1);
                setPage(
                  (pageGroup - 1) * PAGE_GROUP_SIZE + PAGE_GROUP_SIZE - 1
                );
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
            className={`notice-pagination-btn${
              page === startPage + idx ? " active" : ""
            }`}
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
