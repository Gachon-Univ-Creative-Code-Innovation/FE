import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import api from "../api/instance";

const WS_URL = "wss://a-log.site/ws/chat";
// const WS_URL = "ws://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8000/ws/chat";
const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [eventQueue, setEventQueue] = useState([]);
  const [unreadTotalCount, setUnreadTotalCount] = useState(0);
  
  // WebSocket 연결 함수 (명시적 호출 가능)
  const connectWebSocket = useCallback((token) => {
    if (!token) return;
    if (ws.current) {
      try { ws.current.close(); } catch (e) {}
    }
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

    ws.current.pingInterval = pingInterval;
  }, []);

  // mount 시 자동 연결 (토큰 있으면)
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) connectWebSocket(token);
    return () => {
      if (ws.current) {
        try { ws.current.close(); } catch (e) {}
        if (ws.current.pingInterval) clearInterval(ws.current.pingInterval);
      }
    };
  }, [connectWebSocket]);

  // AUTH_SUCCESS 발생 시 REST로 전체 안 읽은 메시지 수 동기화
  useEffect(() => {
    if (authSuccess) {
      const token = localStorage.getItem("jwtToken");
      api.get("message-service/count/unread", {
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
    <WebSocketContext.Provider value={{ ws, authSuccess, useWebSocketEvent, unreadTotalCount, setUnreadTotalCount, connectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 