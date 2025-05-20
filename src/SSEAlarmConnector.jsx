import { useEffect, useRef } from "react";
import { useAlarmStore } from "./store/useAlarmStore";

function SSEAlarmConnector() {
  const setHasUnread = useAlarmStore((state) => state.setHasUnread);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const lastMessageTimeRef = useRef(Date.now());

  const connectSSE = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    // 기존 연결이 있다면 정리
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 새로운 SSE 연결 생성
    const eventSource = new EventSource(
      `https://a-log.site/api/alarm-service/notifications/subscribe?token=${token}`
    );

    eventSourceRef.current = eventSource;

    // 알림 이벤트 리스너
    eventSource.addEventListener("alarm", (event) => {
      try {
        const data = JSON.parse(event.data);
        setHasUnread(data.existAlarm);
        lastMessageTimeRef.current = Date.now();
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    });

    // keep-alive 메시지 처리
    eventSource.addEventListener("keep-alive", () => {
      lastMessageTimeRef.current = Date.now();
    });

    // 연결 성공 시
    eventSource.onopen = () => {
      console.log("SSE connection established");
      lastMessageTimeRef.current = Date.now();
      // 재연결 시도 중이었다면 타임아웃 클리어
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    // 에러 발생 시
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();

      // 재연결 시도 (5초 후)
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect SSE...");
          reconnectTimeoutRef.current = null;
          connectSSE();
        }, 5000);
      }
    };
  };

  // 연결 상태 주기적 체크 (30초마다)
  useEffect(() => {
    const checkConnection = () => {
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTimeRef.current;
      
      // 65분(3900000ms) 이상 메시지가 없으면 재연결
      if (timeSinceLastMessage > 3900000) {
        console.log("No messages received for over 65 minutes, reconnecting...");
        connectSSE();
      }
    };

    const intervalId = setInterval(checkConnection, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    connectSSE();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // 토큰 변경 감지
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "jwtToken") {
        connectSSE();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return null;
}

export default SSEAlarmConnector; 