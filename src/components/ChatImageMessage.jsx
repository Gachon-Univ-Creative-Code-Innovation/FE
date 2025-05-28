import React, { useEffect, useState } from "react";
import api from "../api/instance";

const ChatImageMessage = ({ objectUrl, alt }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get(
          `/message-service/s3/image-url?objectUrl=${encodeURIComponent(objectUrl)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImgUrl(res.data.data);
      } catch (e) {
        setImgUrl(null);
      }
    };
    fetchPresignedUrl();
  }, [objectUrl]);

  if (!imgUrl) return <span>이미지 불러오는 중...</span>;
  return (
    <img
      src={imgUrl}
      alt={alt || "채팅 이미지"}
      className="messageroom-image"
      onClick={() => window.open(imgUrl, "_blank")}
      style={{ cursor: "pointer" }}
    />
  );
};

export default ChatImageMessage; 