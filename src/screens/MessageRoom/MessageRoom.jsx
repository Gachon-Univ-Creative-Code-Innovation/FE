import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import MessageExit from "../../icons/MessageExit/MessageExit";
import MessageInput from "../../components/MessageInputBox/MessageInputBox";
import CommunityRule from "../CommunityRule/CommunityRule";
import MessageRoomExit from "../MessageRoomExit/MessageRoomExit";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import axios from "axios";
import "./MessageRoom.css";

// 시간 포맷팅 함수
function formatTime(isoString) {
  if (!isoString) return "";
  const now = new Date();
  const date = new Date(isoString);

  // 오늘 여부 판별
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (isToday) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const isPM = hours >= 12;
    const period = isPM ? "오후" : "오전";
    hours = hours % 12 || 12;
    return `${period} ${hours}:${minutes}`;
  }

  // 올해 여부 판별
  if (now.getFullYear() === date.getFullYear()) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  // 올해 이외
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export const MessageRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showRulePopup, setShowRulePopup] = useState(false);
  const [closingRule, setClosingRule] = useState(false);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [closingExit, setClosingExit] = useState(false);

  // 채팅 메시지 조회
  const fetchMessages = async (pageNum) => {
    if (loading) return; // 중복 방지
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://43.201.107.237:8082/api/message-service/with/${id}?page=${pageNum}&size=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newMessages = response.data.data.content || [];
      setMessages((prev) => {
        const merged = [...newMessages, ...prev];
        return merged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
      setHasMore(!response.data.data.last);
    } catch (error) {
      console.error("채팅 메시지 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // id가 바뀌면 초기화 및 첫 페이지 로드
  useEffect(() => {
    setMessages([]);
    setPage(0);
    fetchMessages(0);
  }, [id]);

  // page가 바뀔 때마다 fetchMessages(page) 호출 (id 변경 시 0페이지는 위에서 처리)
  useEffect(() => {
    if (page === 0) return;
    fetchMessages(page);
  }, [page]);

  // 최초 데이터 로드 후/과거 메시지 추가 후 스크롤 위치 보정
  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (page === 0) {
      // 최초 로딩: 맨 아래로
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    } else {
      // 과거 메시지 추가: 추가된 메시지 높이만큼 올려줌
      const prevHeight = chatContainerRef.current.scrollHeight;
      setTimeout(() => {
        const newHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop = newHeight - prevHeight;
      }, 0);
    }
  }, [messages]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!chatContainerRef.current || loading || !hasMore) return;
    const { scrollTop } = chatContainerRef.current;
    if (scrollTop === 0 && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // 스크롤 이벤트 리스너 등록 (최초 1회만)
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // 메시지 날짜 그룹화
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = date.toISOString().split("T")[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const openRulePopup = () => {
    setShowRulePopup(true);
    setClosingRule(false);
  };
  const closeRulePopup = () => {
    setClosingRule(true);
    setTimeout(() => setShowRulePopup(false), 250);
  };

  const openExitPopup = () => {
    setShowExitPopup(true);
    setClosingExit(false);
  };
  const closeExitPopup = () => {
    setClosingExit(true);
    setTimeout(() => setShowExitPopup(false), 250);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <PageTransitionWrapper>
      <div className="messageroom-screen">
        <div className="messageroom-view">
          <div className="messageroom-header">
            <div className="messageroom-back-wrapper" onClick={handleGoBack}>
              <GoBackIcon className="messageroom-back-icon" />
            </div>
            <div className="messageroom-username">
              {targetUser?.nickname || "사용자"} (ID: {id})
            </div>
            <div className="messageroom-link-wrapper">
              <MessageExit
                className="messageroom-link-icon"
                onClick={openExitPopup}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="messageroom-notice">
            <p className="messageroom-notice-text">
              서로가 존중받는 커뮤니티를 위해 이용규칙을 함께 지켜주세요.
              <br />
              규칙 위반 시 서비스 이용이 제한될 수 있어요.
            </p>
            <p
              className="messageroom-rule-link"
              onClick={openRulePopup}
              style={{ cursor: "pointer" }}
            >
              👉 커뮤니티 이용규칙 자세히 보기
            </p>
          </div>

          <div className="messageroom-chat" ref={chatContainerRef}>
            {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
              <React.Fragment key={date}>
                <div className="messageroom-date">
                  <div className="messageroom-date-text">
                    {formatTime(date)}
                  </div>
                </div>
                {msgs.map((chat, idx) =>
                  chat.senderId === localStorage.getItem("userId") ? (
                    <div className="messageroom-my-message" key={chat.id}>
                      <div className="messageroom-time-right">
                        {formatTime(chat.createdAt)}
                      </div>
                      <div className="messageroom-bubble-my">
                        {chat.content}
                      </div>
                    </div>
                  ) : (
                    <div className="messageroom-other-message" key={chat.id}>
                      <div className="messageroom-profile">
                        <img src="/img/basic_profile_photo.jpeg" alt="profile" />
                      </div>
                      <div className="messageroom-info">
                        <div className="messageroom-nickname">
                          {chat.senderNickname}
                        </div>
                        <div className="messageroom-bubble-other">
                          {chat.content}
                        </div>
                      </div>
                      <div className="messageroom-time-left">
                        {formatTime(chat.createdAt)}
                      </div>
                    </div>
                  )
                )}
              </React.Fragment>
            ))}
            {loading && <div className="messageroom-loading">로딩 중...</div>}
          </div>

          <div className="messageroom-input-wrapper">
            <MessageInput 
              className="messageroom-input-icon" 
              roomId={id}
              onMessageSent={(newMessage) => {
                setMessages((prev) => [newMessage, ...prev]);
              }}
            />
          </div>
        </div>

        {showRulePopup && (
          <div className="messageroom-modal-overlay" onClick={closeRulePopup}>
            <div
              className={`messageroom-modal-content ${
                closingRule ? "fade-out" : "fade-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <CommunityRule onClose={closeRulePopup} />
            </div>
          </div>
        )}

        {showExitPopup && (
          <div className="exitpopup-overlay" onClick={closeExitPopup}>
            <div
              className={`exitpopup-content ${
                closingExit ? "fade-out" : "fade-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageRoomExit onClose={closeExitPopup} />
            </div>
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  );
};

export default MessageRoom;
