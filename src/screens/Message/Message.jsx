import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../../components/Navbar2/Navbar2";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./Message.css";
import { useWebSocket } from "../../contexts/WebSocketContext";

// 시간 포맷팅 함수
function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  // KST로 변환
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // 오늘 여부 판별 (KST 기준)
  const isToday =
    nowKst.getFullYear() === kstDate.getFullYear() &&
    nowKst.getMonth() === kstDate.getMonth() &&
    nowKst.getDate() === kstDate.getDate();

  if (isToday) {
    let hours = kstDate.getHours();
    const minutes = kstDate.getMinutes().toString().padStart(2, "0");
    const isPM = hours >= 12;
    const period = isPM ? "오후" : "오전";
    hours = hours % 12 || 12;
    return `${period} ${hours}:${minutes}`;
  }

  // 올해 여부 판별 (KST 기준)
  if (nowKst.getFullYear() === kstDate.getFullYear()) {
    return `${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;
  }

  // 올해 이외
  return `${kstDate.getFullYear()}년 ${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;
}

export const Message = () => {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const [allData, setAllData] = useState([]);
  const [dummyList, setDummyList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const { useWebSocketEvent } = useWebSocket();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/message-service/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllData(res.data.data || []);
      } catch (err) {
        setAllData([]);
        console.error("채팅방 리스트 불러오기 실패:", err);
      }
    };
    fetchRooms();
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

  // 실시간 메시지 도착 시 리스트 갱신 및 맨 앞으로 이동
  useWebSocketEvent(undefined, (data) => {
    if (data.id && data.senderId && data.receiverId) {
      setAllData(prev => {
        const idx = prev.findIndex(room =>
          room.targetUserId === data.senderId || room.targetUserId === data.receiverId
        );
        if (idx === -1) return prev;
        const updatedRoom = {
          ...prev[idx],
          lastMessage: data.content,
          lastMessageTime: data.createdAt,
          unreadCount: data.unreadCount !== undefined ? data.unreadCount : prev[idx].unreadCount + 1,
        };
        return [updatedRoom, ...prev.filter((_, i) => i !== idx)];
      });
      setDummyList(prev => {
        const idx = prev.findIndex(room =>
          room.targetUserId === data.senderId || room.targetUserId === data.receiverId
        );
        if (idx === -1) return prev;
        const updatedRoom = {
          ...prev[idx],
          lastMessage: data.content,
          lastMessageTime: data.createdAt,
          unreadCount: data.unreadCount !== undefined ? data.unreadCount : prev[idx].unreadCount + 1,
        };
        return [updatedRoom, ...prev.filter((_, i) => i !== idx)];
      });
    }
  });

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
                key={item.targetUserId}
                ref={idx === dummyList.length - 1 ? lastItemRef : null}
                onClick={() => navigate(`/message-room/${item.targetUserId}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="message-profile">
                  <img
                    className="message-avatar"
                    alt="profile"
                    src={"/img/ellipse-12-12.png"}
                  />
                </div>
                <div className="message-content">
                  <div className="message-nickname">{item.targetNickname}</div>
                  <div className="message-text">{item.lastMessageType === "IMAGE" ? "사진" : item.lastMessage}</div>
                </div>
                <div className="message-date-wrapper">
                  <div className="message-date">{formatTime(item.lastMessageTime)}</div>
                  {item.unreadCount > 0 && (
                    <div className="message-unread-badge">{item.unreadCount}</div>
                  )}
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
