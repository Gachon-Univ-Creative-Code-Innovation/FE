import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import MessageExit from "../../icons/MessageExit/MessageExit";
import SearchIcon from "../../icons/SearchIcon/SearchIcon";
import MessageInput from "../../components/MessageInputBox/MessageInputBox";
import CommunityRule from "../CommunityRule/CommunityRule";
import MessageRoomExit from "../MessageRoomExit/MessageRoomExit";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./MessageRoom.css";
import { useWebSocket } from "../../contexts/WebSocketContext";
import ChatImageMessage from "../../components/ChatImageMessage";

// const WS_URL = "wss://a-log.site/ws/chat";
const WS_URL = "ws://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8000/ws/chat";

// 시간 포맷팅 함수 (채팅방 내부: 오전/오후 시:분)
function formatChatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  let hours = kstDate.getHours();
  const minutes = kstDate.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  const period = isPM ? "오후" : "오전";
  hours = hours % 12 || 12;
  return `${period} ${hours}:${minutes}`;
}

// 날짜 구분 박스 포맷 (올해면 MM월 DD일, 아니면 YYYY년 MM월 DD일)
function formatChatDateBox(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  if (nowKst.getFullYear() === kstDate.getFullYear()) {
    return `${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;
  }
  return `${kstDate.getFullYear()}년 ${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;
}

export const MessageRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const { ws, authSuccess, useWebSocketEvent, setUnreadTotalCount } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  const [targetUser, setTargetUser] = useState(null);
  const [page, setPage] = useState(0);
  const lastLoadedPageRef = useRef(0);  // 마지막으로 로드된 페이지를 저장할 ref
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showRulePopup, setShowRulePopup] = useState(false);
  const [closingRule, setClosingRule] = useState(false);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [closingExit, setClosingExit] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const myUserId = Number(localStorage.getItem("userId"));
  const targetUserId = Number(id);

  const readSet = useRef(new Set());
  const prevHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  const [searchIndexes, setSearchIndexes] = useState([]);
  const [currentSearchIdx, setCurrentSearchIdx] = useState(0);
  const messageRefs = useRef([]);

  const [allMessages, setAllMessages] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);

  const showSearchRef = useRef(showSearch);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // AUTH_SUCCESS 이벤트를 구독해서 ENTER 전송
  useWebSocketEvent("AUTH_SUCCESS", () => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ type: "ENTER", roomId: id }));
    }
  });

  // 상대방 ENTER 이벤트 수신 시 내 메시지 모두 읽음 처리
  useWebSocketEvent("ENTER", (data) => {
    if (String(data.userId) === String(targetUserId)) {
      setMessages(prev =>
        prev.map(msg =>
          msg.senderId === myUserId && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  });

  // 읽음 이벤트(type: 'READ')
  useWebSocketEvent("READ", (data) => {
    readSet.current.add(String(data.messageId));
    setMessages(prev =>
      prev.map(msg =>
        String(msg.receiverId) === String(data.readerId)
          ? { ...msg, read: true }
          : msg
      )
    );
  });

  // 일반 메시지(type 없음, id/senderId/receiverId 등 있음)
  useWebSocketEvent(undefined, (data) => {
    if (data.id && data.senderId && data.receiverId) {
      // 현재 채팅방의 유저와 관련된 메시지만 처리
      const isCurrentRoomMessage = 
        (String(data.senderId) === String(myUserId) && String(data.receiverId) === String(targetUserId)) ||
        (String(data.senderId) === String(targetUserId) && String(data.receiverId) === String(myUserId));

      if (isCurrentRoomMessage) {
        setMessages(prev => {
          // optimistic 메시지(임시 id, 같은 content, 같은 senderId, createdAt이 1분 이내) 찾기
          const idx = prev.findIndex(
            m =>
              !m.id &&
              m.content === data.content &&
              m.senderId === data.senderId &&
              Math.abs(new Date(m.createdAt) - new Date(data.createdAt)) < 60 * 1000 // 1분 이내
          );
          if (idx !== -1) {
            // optimistic 메시지 교체
            const newArr = [...prev];
            newArr[idx] = { ...data, read: data.read };
            return newArr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          } else {
            // 그냥 추가
            const merged = [...prev, { ...data, read: data.read }];
            const unique = Array.from(new Map(merged.map(m => [m.id, m])).values());
            return unique.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          }
        });
        // 내가 receiver이면서 읽지 않은 메시지면 READ 요청
        if (String(data.receiverId) === String(myUserId) && !data.read) {
          ws.current.send(JSON.stringify({
            type: "READ",
            messageId: data.id,
            roomId: id
          }));
          // 메시지 전송 후에도 바로 렌더링
          setMessages(prev =>
            prev.map(msg =>
              String(msg.id) === String(data.id) ? { ...msg, read: true } : msg
            )
          );
        }
      }
    }
  });

  // 채팅 메시지 조회
  const fetchMessages = async (pageNum) => {
    if (loading) return; // 중복 방지
    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      const response = await api.get(
        `/message-service/with/${id}?page=${pageNum}&size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newMessages = response.data.data.content || [];
      
      setMessages((prev) => {
        const merged = [...newMessages, ...prev];
        const unique = Array.from(new Map(merged.map(m => [m.id || m.createdAt + m.content, m])).values());
        return unique.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
      setHasMore(!response.data.data.last);
    } catch (error) {
      console.error("채팅 메시지 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 입장(마운트) 시 ENTER 전송
  useEffect(() => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ type: "ENTER", roomId: id }));
    }
  }, [id, ws]);

  // id가 바뀌면 초기화 및 첫 페이지 로드
  useEffect(() => {
    const fetchTargetUserInfo = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await api.get(
          "/message-service/rooms",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const targetUserInfo = response.data.data.find(
          room => room.targetUserId === parseInt(id)
        );
        if (targetUserInfo) {
          setTargetUser({
            nickname: targetUserInfo.targetNickname,
            profile_url: targetUserInfo.targetProfileUrl
          });
        } else {
          setTargetUser({ nickname: "" , profile_url: ""});
        }
      } catch (error) {
        setTargetUser({ nickname: "" , profile_url: ""});
      }
    };

    setMessages([]);
    setPage(0);
    fetchTargetUserInfo();
    fetchMessages(0);
  }, [id]);

  // page가 바뀔 때마다 fetchMessages(page) 호출 (id 변경 시 0페이지는 위에서 처리)
  useEffect(() => {
    if (page === 0) return;
    lastLoadedPageRef.current = page;  // 페이지 로드 시 ref 업데이트
    fetchMessages(page);
  }, [page]);

  // 1. 과거 메시지 추가 전 prevHeight, prevScrollTop 저장 (page가 바뀔 때만)
  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (page > 0) {
      prevHeightRef.current = chatContainerRef.current.scrollHeight;
      prevScrollTopRef.current = chatContainerRef.current.scrollTop;
    }
  }, [page]);

  // 2. 과거 메시지 추가 후(즉, page가 바뀐 직후)만 스크롤 위치 보정
  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (page > 0) {
      const prevHeight = prevHeightRef.current;
      const prevScrollTop = prevScrollTopRef.current;
      setTimeout(() => {
        const newHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop = prevScrollTop + (newHeight - prevHeight);
      }, 0);
    } else if (page === 0 && messages.length > 0) {
      // 최초 로딩: 맨 아래로
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [page, messages]);

  // 3. 내가 메시지 보낼 때는 항상 맨 아래로 스크롤 (page가 0일 때만)
  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (page !== 0) return; // 과거 메시지 추가 중에는 실행하지 않음
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId === myUserId) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, myUserId, page]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!chatContainerRef.current || loading || !hasMore) return;
    const { scrollTop } = chatContainerRef.current;
    if (scrollTop === 0 && !loading && hasMore) {
      setPage(lastLoadedPageRef.current + 1);  // 마지막으로 로드된 페이지의 다음 페이지 요청
    }
  };

  // 스크롤 이벤트 리스너 등록 (검색 중에는 제거)
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    if (showSearch && searchTerm) {
      chatContainer.removeEventListener("scroll", handleScroll);
      return;
    }

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [showSearch, searchTerm, loading, hasMore]);

  // 메시지 날짜 그룹화 (KST 기준)
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      // KST로 변환
      const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      const dateKey = kstDate.toISOString().split("T")[0]; // YYYY-MM-DD
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
    navigate("/message");
  };

  // 퇴장(언마운트) 시 LEAVE + REST 동기화
  useEffect(() => {
    return () => {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.send(JSON.stringify({ type: "LEAVE", roomId: id }));
      }
      // REST 동기화
      const token = localStorage.getItem("jwtToken");
      api.get("/message-service/count/unread", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (typeof res.data === "number") {
          setUnreadTotalCount(res.data);
        } else if (res.data.data !== undefined) {
          setUnreadTotalCount(res.data.data);
        }
      })
      .catch(() => setUnreadTotalCount(0));
    };
  }, [id, ws, setUnreadTotalCount]);

  // 전체 메시지 모두 불러오기 (입장 시)
  useEffect(() => {
    let ignore = false;
    const fetchAllMessages = async () => {
      let page = 0, hasMore = true, all = [];
      while (hasMore) {
        const res = await api.get(`/message-service/with/${id}?page=${page}&size=1000`);
        const msgs = res.data.data.content || [];
        all = [...msgs, ...all];
        hasMore = !res.data.data.last;
        page++;
      }
      if (!ignore) {
        // 시간순 정렬 (최신 순)
        const sorted = all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllMessages(sorted);
        setAllLoaded(true);
      }
    };
    fetchAllMessages();
    return () => { ignore = true; };
  }, [id]);

  // 검색 인덱스 추출 (allMessages 기준)
  useEffect(() => {
    if (searchTerm) {
      const indexes = allMessages
        .map((msg, idx) =>
          msg.content && msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ? idx : -1
        )
        .filter(idx => idx !== -1);
      setSearchIndexes(indexes);
      setCurrentSearchIdx(0);
    } else {
      setSearchIndexes([]);
      setCurrentSearchIdx(0);
    }
  }, [searchTerm, allMessages]);

  // 검색 결과 이동 (allMessages 기준)
  useEffect(() => {
    if (searchIndexes.length > 0 && messageRefs.current.length > 0) {
      // reverse된 배열 기준으로 인덱스 변환
      const reversedIdx = allMessages.length - 1 - searchIndexes[currentSearchIdx];
      const el = messageRefs.current[reversedIdx];
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }, [currentSearchIdx, searchIndexes, allMessages.length]);

  useEffect(() => {
    if (!showSearch) {
      setSearchTerm("");
    }
  }, [showSearch]);

  return (
    <PageTransitionWrapper>
      <div className="messageroom-screen">
        <div className="messageroom-view">
          <div className="messageroom-header">
            <div className="messageroom-back-wrapper" onClick={handleGoBack}>
              <GoBackIcon className="messageroom-back-icon" />
            </div>
            <div className="messageroom-username">
              {targetUser?.nickname || ""}
            </div>
            <div className="messageroom-link-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <SearchIcon
                className="messageroom-search-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowSearch(v => !v)}
              />
              <MessageExit
                className="messageroom-link-icon"
                onClick={openExitPopup}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          {/* 검색 바 (돋보기 클릭 시에만 노출) */}
          {showSearch && (
            <div className="messageroom-search-bar">
              <input
                type="text"
                placeholder="메시지 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="messageroom-search-input"
                autoFocus
              />
              {searchIndexes.length > 0 && (
                <div className="messageroom-search-nav">
                  <button
                    className="messageroom-search-btn"
                    onClick={() =>
                      setCurrentSearchIdx(
                        (currentSearchIdx - 1 + searchIndexes.length) % searchIndexes.length
                      )
                    }
                  >
                    이전
                  </button>
                  <span className="messageroom-search-count">
                    {currentSearchIdx + 1} / {searchIndexes.length}
                  </span>
                  <button
                    className="messageroom-search-btn"
                    onClick={() =>
                      setCurrentSearchIdx((currentSearchIdx + 1) % searchIndexes.length)
                    }
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="messageroom-chat" ref={chatContainerRef}>
            {showSearch && searchTerm
              ? [...allMessages].reverse().map((chat, idx) => {
                  // 하이라이트, ref, 기타 기존 코드 동일하게 적용
                  const highlight = (text, keyword) => {
                    if (!keyword) return text;
                    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
                    return parts.map((part, i) =>
                      part.toLowerCase() === keyword.toLowerCase() ? (
                        <mark key={i}>{part}</mark>
                      ) : (
                        part
                      )
                    );
                  };
                  return chat.senderId === Number(localStorage.getItem("userId")) ? (
                    <div
                      className="messageroom-my-message"
                      key={chat.id || chat.createdAt + chat.content}
                      ref={el => (messageRefs.current[idx] = el)}
                    >
                      <div className="messageroom-meta-wrapper">
                        {!chat.read && (
                          <div className="messageroom-unread-my">안 읽음</div>
                        )}
                        <div className="messageroom-time-right">
                          {formatChatTime(chat.createdAt)}
                        </div>
                      </div>
                      <div className="messageroom-bubble-my align-profile-height">
                        {chat.messageType === "IMAGE" ? (
                          <ChatImageMessage objectUrl={chat.content} />
                        ) : (
                          highlight(chat.content, searchTerm)
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="messageroom-other-message"
                      key={chat.id || chat.createdAt + chat.content}
                      ref={el => (messageRefs.current[idx] = el)}
                    >
                      <div className="messageroom-profile">
                      <img src={targetUser?.profile_url ? targetUser.profile_url : "/img/basic_profile_photo.png"}
                            alt="profile"
                            onError={e => { e.target.src = "/img/basic_profile_photo.png"; }}
                            />
                      </div>
                      <div className="messageroom-info">
                        <div className="messageroom-nickname">
                          {chat.senderNickname}
                        </div>
                        <div className="messageroom-bubble-other align-profile-height">
                          {chat.messageType === "IMAGE" ? (
                            <ChatImageMessage objectUrl={chat.content} />
                          ) : (
                            highlight(chat.content, searchTerm)
                          )}
                        </div>
                      </div>
                      <div className="messageroom-meta-wrapper">
                        {!chat.read && (
                          <div className="messageroom-unread">안 읽음</div>
                        )}
                        <div className="messageroom-time-left">
                          {formatChatTime(chat.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              : Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
                  <React.Fragment key={date}>
                    <div className="messageroom-date">
                      <span className="messageroom-date-text">{formatChatDateBox(date)}</span>
                    </div>
                    {msgs.map((chat, idx) => {
                      const flatIdx = messages.findIndex(m => m.id === chat.id);
                      const highlight = (text, keyword) => {
                        if (!keyword) return text;
                        const parts = text.split(new RegExp(`(${keyword})`, "gi"));
                        return parts.map((part, i) =>
                          part.toLowerCase() === keyword.toLowerCase() ? (
                            <mark key={i}>{part}</mark>
                          ) : (
                            part
                          )
                        );
                      };
                      return chat.senderId === Number(localStorage.getItem("userId")) ? (
                        <div
                          className="messageroom-my-message"
                          key={chat.id || chat.createdAt + chat.content}
                          ref={el => (messageRefs.current[flatIdx] = el)}
                        >
                          <div className="messageroom-meta-wrapper">
                            {!chat.read && (
                              <div className="messageroom-unread-my">안 읽음</div>
                            )}
                            <div className="messageroom-time-right">
                              {formatChatTime(chat.createdAt)}
                            </div>
                          </div>
                          <div className="messageroom-bubble-my align-profile-height">
                            {chat.messageType === "IMAGE" ? (
                              <ChatImageMessage objectUrl={chat.content} />
                            ) : (
                              highlight(chat.content, searchTerm)
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="messageroom-other-message"
                          key={chat.id || chat.createdAt + chat.content}
                          ref={el => (messageRefs.current[flatIdx] = el)}
                        >
                          <div className="messageroom-profile">
                            <img src={targetUser?.profile_url ? targetUser.profile_url : "/img/basic_profile_photo.png"}
                            alt="profile"
                            onError={e => { e.target.src = "/img/basic_profile_photo.png"; }}
                            />
                          </div>
                          <div className="messageroom-info">
                            <div className="messageroom-nickname">
                              {chat.senderNickname}
                            </div>
                            <div className="messageroom-bubble-other align-profile-height">
                              {chat.messageType === "IMAGE" ? (
                                <ChatImageMessage objectUrl={chat.content} />
                              ) : (
                                highlight(chat.content, searchTerm)
                              )}
                            </div>
                          </div>
                          <div className="messageroom-meta-wrapper">
                            {!chat.read && (
                              <div className="messageroom-unread">안 읽음</div>
                            )}
                            <div className="messageroom-time-left">
                              {formatChatTime(chat.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
            {loading && <div className="messageroom-loading">로딩 중...</div>}
          </div>

          <div className="messageroom-input-wrapper">
            <MessageInput 
              className="messageroom-input-icon" 
              roomId={id}
              ws={ws}
              onSend={msg => {
                setMessages(prev => {
                  const tempId = `temp-${Date.now()}-${Math.random()}`;
                  const isImage = msg.startsWith('message/');  // 임시 URL로 시작하는지 확인
                  const merged = [
                    ...prev,
                    {
                      id: tempId,
                      senderId: Number(localStorage.getItem("userId")),
                      receiverId: Number(id),
                      content: msg,
                      messageType: isImage ? "IMAGE" : undefined,  // 이미지인 경우 messageType 설정
                      createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
                      read: false,
                    }
                  ];
                  const unique = Array.from(new Map(merged.map(m => [m.id || m.createdAt + m.content, m])).values());
                  return unique.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                });
                setPage(0); // 메시지 추가 후 페이지 0으로 리셋 (스크롤 위치 조정용)
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
};export default MessageRoom;


