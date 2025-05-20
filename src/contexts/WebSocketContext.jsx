import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const WS_URL = "wss://a-log.site/ws/chat";
const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [eventQueue, setEventQueue] = useState([]);
  const [unreadTotalCount, setUnreadTotalCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    ws.current = new window.WebSocket(WS_URL);

    const handleOpen = () => {
      console.log("WebSocket 연결됨");
      ws.current.send(JSON.stringify({ type: "AUTH", token }));
    };

    ws.current.addEventListener("open", handleOpen);
    ws.current.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "AUTH_SUCCESS") {
        setAuthSuccess(true);
      }
      if (data.totalUnreadCount !== undefined) {
        setUnreadTotalCount(data.totalUnreadCount);
      }
      setEventQueue((prev) => [...prev, data]);
    });
    ws.current.addEventListener("close", (e) => {
      console.log("WebSocket 연결 닫힘", e);
    });
    ws.current.addEventListener("error", (e) => {
      console.log("WebSocket 에러", e);
    });

    // 이미 연결된 상태라면 handleOpen 즉시 실행
    if (ws.current.readyState === window.WebSocket.OPEN) {
      handleOpen();
    }

    // 30초마다 ping 메시지 전송
    const pingInterval = setInterval(() => {
      if (ws.current && ws.current.readyState === window.WebSocket.OPEN) {
        console.log("ping 전송!");
        ws.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => {
      try {
        if (
          ws.current &&
          (ws.current.readyState === 0 || ws.current.readyState === 1) &&
          typeof ws.current.close === "function"
        ) {
          ws.current.close();
        }
      } catch (e) {
        // 연결이 이미 닫혔거나 예외 발생 시 무시
      }
      clearInterval(pingInterval);
    };
  }, []);

  // AUTH_SUCCESS 발생 시 REST로 전체 안 읽은 메시지 수 동기화
  useEffect(() => {
    if (authSuccess) {
      const token = localStorage.getItem("jwtToken");
      axios.get("https://a-log.site/api/message-service/count/unread", {
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
    }
  }, [authSuccess]);

  // 이벤트 큐에서 원하는 타입만 꺼내는 헬퍼
  const useWebSocketEvent = (type, handler) => {
    useEffect(() => {
      if (!eventQueue.length) return;
      const filtered = eventQueue.filter(e => e.type === type || (type === undefined && !e.type));
      if (filtered.length) {
        filtered.forEach(handler);
        setEventQueue(q => q.filter(e => !(e.type === type || (type === undefined && !e.type))));
      }
    }, [eventQueue, type, handler]);
  };

  return (
    <WebSocketContext.Provider value={{ ws, authSuccess, useWebSocketEvent, unreadTotalCount, setUnreadTotalCount }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 