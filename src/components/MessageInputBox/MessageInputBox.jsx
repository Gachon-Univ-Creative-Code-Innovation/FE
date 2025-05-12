import React, { useState } from "react";
import SendIcon from "../../icons/SendIcon/SendIcon";
import axios from "axios";
import "./MessageInputBox.css";

const MessageInputBox = ({ roomId, onMessageSent }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `http://43.201.107.237:8082/api/message-service/rooms/${roomId}/messages`,
        {
          content: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage("");
        if (onMessageSent) {
          onMessageSent(response.data.data);
        }
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  return (
    <form className="messageinput-wrapper" onSubmit={handleSubmit}>
      <input
        type="text"
        className="messageinput-input"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="messageinput-send-btn">
        <SendIcon className="messageinput-send-icon" />
      </button>
    </form>
  );
};

export default MessageInputBox;
