import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const WS_URL = "ws://43.201.107.237:8082/ws/chat";
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
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "AUTH", token }));
    };
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "AUTH_SUCCESS") {
        setAuthSuccess(true);
      }
      if (data.totalUnreadCount !== undefined) {
        setUnreadTotalCount(data.totalUnreadCount);
      }
      setEventQueue((prev) => [...prev, data]);
    };
    return () => {
      ws.current?.close();
    };
  }, []);

  // AUTH_SUCCESS 발생 시 REST로 전체 안 읽은 메시지 수 동기화
  useEffect(() => {
    if (authSuccess) {
      const token = localStorage.getItem("jwtToken");
      axios.get("http://43.201.107.237:8082/api/message-service/count/unread", {
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