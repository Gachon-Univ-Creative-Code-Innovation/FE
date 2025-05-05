import React from "react";
import SendIcon from "../../icons/SendIcon/SendIcon";
import "./MessageInputBox.css";

const MessageInputBox = () => {
  return (
    <div className="messageinput-wrapper">
      <input
        type="text"
        className="messageinput-input"
        placeholder="메시지를 입력하세요..."
      />
      <button className="messageinput-send-btn">
        <SendIcon className="messageinput-send-icon" />
      </button>
    </div>
  );
};

export default MessageInputBox;
