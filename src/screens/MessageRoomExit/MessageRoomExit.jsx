import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MessageRoomExit.css";

export const MessageRoomExit = ({ onClose, onDeleteRoom }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // 현재 채팅방 ID

  const handleLeave = () => {
    if (onDeleteRoom && typeof onDeleteRoom === "function") {
      onDeleteRoom(id);
    }
    navigate("/message");
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
