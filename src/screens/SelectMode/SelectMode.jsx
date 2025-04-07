import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const SelectMode = ({ onClose }) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    onClose(); // 모달 닫기
    navigate("/login"); // login 페이지로 이동
  };

  return (
    <div className="select-mode">
      <div className="select-mode-wrapper">
        <div className="div-4" style={{ top: 0, left: 0 }}>
          {/* 닫기 버튼 */}
          <div
            className="overlap-19"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            <div className="group">
              <img className="vector-2" alt="닫기" src="/img/vector.svg" />
            </div>
          </div>

          <p className="choose-your">
            Choose your preferred mode.
            <br />
            <br />
            User Mode
            <br />
            Read, write, and follow posts from other users.
            <br />
            <br />
            Headhunter Mode
            <br />
            Discover talented individuals and explore their work.
          </p>

          <div className="overlap-group-7">
            <div className="group-2">
              <div
                className="frame-45"
                onClick={handleUserClick}
                style={{ cursor: "pointer" }}
              >
                <div className="text-wrapper-40">User</div>
              </div>
              <div className="frame-46">
                <div className="text-wrapper-41">Headhunter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
