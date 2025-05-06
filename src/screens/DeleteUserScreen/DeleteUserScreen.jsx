import React from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteUserScreen.css";

export const DeleteUser = ({ onClose }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    navigate("/mainpagebefore");
  };

  return (
    <div className="deleteuser-overlay" onClick={onClose}>
      <div className="deleteuser-content" onClick={(e) => e.stopPropagation()}>
        <div className="deleteuser-frame-3">
          <div className="deleteuser-text-wrapper-3">
            정말 탈퇴하시겠습니까?
          </div>
          <p className="deleteuser-p">
            탈퇴하시면 이전으로 돌아가실 수 없습니다.
          </p>
        </div>

        <div className="deleteuser-frame-4">
          <div className="deleteuser-frame-5" onClick={onClose}>
            <div className="deleteuser-text-wrapper-4">취소</div>
          </div>
          <div className="deleteuser-frame-6" onClick={handleDelete}>
            <div className="deleteuser-text-wrapper-5">탈퇴하기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
