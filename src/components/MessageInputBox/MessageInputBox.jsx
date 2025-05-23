import React, { useState, useRef } from "react";
import SendIcon from "../../icons/SendIcon/SendIcon";
import ImageIcon from "../../icons/ImageIcon/ImageIcon";
import api from "../../api/instance";
import "./MessageInputBox.css";

const MessageInputBox = ({ roomId, ws, onSend }) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    if (ws.current && ws.current.readyState === 1) {
      if (selectedImage) {
        // 1. presigned URL 요청
        const token = localStorage.getItem("jwtToken");
        try {
          const res = await api.post(
            `/message-service/s3/upload-url?fileName=${encodeURIComponent(selectedImage.name)}`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const { presignedUrl, s3ObjectUrl } = res.data.data;

          // 2. S3에 PUT 업로드
          await fetch(presignedUrl, {
            method: "PUT",
            body: selectedImage,
            headers: { "Content-Type": selectedImage.type }
          });

          // 3. s3ObjectUrl을 메시지로 전송
          ws.current.send(
            JSON.stringify({
              type: "MESSAGE",
              receiverId: Number(roomId),
              content: s3ObjectUrl,
              messageType: "IMAGE",
            })
          );
          if (onSend) onSend(s3ObjectUrl, "IMAGE");
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
        }
      } else {
        // 텍스트 메시지 전송
        ws.current.send(
          JSON.stringify({
            type: "MESSAGE",
            receiverId: Number(roomId),
            content: message,
            messageType: "TEXT",
          })
        );
        if (onSend) onSend(message);
      }

      // 상태 초기화
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <form className="messageinput-wrapper" onSubmit={handleSubmit}>
      <button type="button" className="messageinput-image-btn" onClick={handleImageClick}>
        <ImageIcon className="messageinput-image-icon" color="#a3b3bf" />
      </button>
      {imagePreview && (
        <div className="messageinput-image-preview">
          <img src={imagePreview} alt="Preview" />
          <button type="button" onClick={handleRemoveImage} className="messageinput-remove-image">
            ×
          </button>
        </div>
      )}
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <button type="submit" className="messageinput-send-btn">
        <SendIcon className="messageinput-send-icon" />
      </button>
    </form>
  );
};

export default MessageInputBox;
