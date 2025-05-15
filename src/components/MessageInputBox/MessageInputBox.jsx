import React, { useState, useRef } from "react";
import SendIcon from "../../icons/SendIcon/SendIcon";
import "./MessageInputBox.css";

const MessageInputBox = ({ roomId, ws, onSend }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
    // 높이 자동 조정
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(
        JSON.stringify({
          type: "MESSAGE",
          receiverId: Number(roomId),
          content: message,
          messageType: "TEXT",
        })
      );
      if (onSend) onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift+Enter는 기본 동작(줄바꿈)
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
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
      <button type="submit" className="messageinput-send-btn">
        <SendIcon className="messageinput-send-icon" />
      </button>
    </form>
  );
};

export default MessageInputBox;
