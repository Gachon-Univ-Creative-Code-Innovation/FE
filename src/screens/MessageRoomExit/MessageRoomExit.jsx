import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./MessageRoomExit.css";

export const MessageRoomExit = ({ onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // 현재 채팅방 ID

  const handleLeave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `http://43.201.107.237:8082/api/message-service/room/exit/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/message");
    } catch (error) {
      alert("채팅방 퇴장에 실패했습니다.");
    }
  };

  return (
    <div className="messageroomexit-wrapper">
      <div className="messageroomexit-header"></div>

      <div className="messageroomexit-body">
        <div className="messageroomexit-title">채팅방에서 나가겠습니까?</div>
        <p className="messageroomexit-desc">
          나가기를 하면 대화목록이 모두 삭제되고 채팅 목록에서도 삭제됩니다.
        </p>
      </div>

      <div className="messageroomexit-buttons">
        <div className="messageroomexit-cancel" onClick={onClose}>
          <div className="messageroomexit-cancel-text">취소</div>
        </div>

        <div className="messageroomexit-leave" onClick={handleLeave}>
          <div className="messageroomexit-leave-text">나가기</div>
        </div>
      </div>
    </div>
  );
};

export default MessageRoomExit;
