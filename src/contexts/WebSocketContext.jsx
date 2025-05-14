import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WS_URL = "ws://43.201.107.237:8082/ws/chat";
const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    ws.current = new window.WebSocket(WS_URL);
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "AUTH", token }));
    };
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.unreadCount !== undefined) setUnreadCount(data.unreadCount);
      if (data.content) setLastMessage(data);
    };
    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, unreadCount, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 