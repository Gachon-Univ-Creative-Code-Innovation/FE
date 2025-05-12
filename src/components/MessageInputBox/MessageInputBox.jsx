import React, { useState, useRef } from "react";
import SendIcon from "../../icons/SendIcon/SendIcon";
import axios from "axios";
import "./MessageInputBox.css";

const MessageInputBox = ({ roomId, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
    // 높이 자동 조정
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

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
      <textarea
        ref={textareaRef}
        className="messageinput-input"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={handleChange}
        rows={1}
        style={{overflowY: 'auto'}}
      />
      <button type="submit" className="messageinput-send-btn">
        <SendIcon className="messageinput-send-icon" />
      </button>
    </form>
  );
};

export default MessageInputBox;
