import { useEffect } from "react";
import { useAlarmStore } from "./store/useAlarmStore";

function SSEAlarmConnector() {
  const setHasUnread = useAlarmStore((state) => state.setHasUnread);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const eventSource = new EventSource(
      `http://localhost:8080/api/alarm-service/notifications/subscribe?token=${token}`
    );

    eventSource.addEventListener("alarm", (event) => {
      const data = JSON.parse(event.data);
      setHasUnread(data.existAlarm);
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [setHasUnread]);

  return null;
}

export default SSEAlarmConnector; 