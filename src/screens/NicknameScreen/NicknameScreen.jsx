import React, { useState } from "react";
import Xbutton from "../../icons/XButton/XButton";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import "./NicknameScreen.css";

export const NicknameScreen = ({ onClose, onSave }) => {
  const [nickname, setNickname] = useState("");
  const [checked, setChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckDuplicate = () => {
    if (nickname === "taken") {
      setIsDuplicate(true);
      setChecked(true);
      setMessage("This nickname is already in use.");
    } else {
      setIsDuplicate(false);
      setChecked(true);
      setMessage("This nickname is available.");
    }
  };

  const handleSave = () => {
    if (!checked) {
      setMessage("Please verify if the nickname is available.");
      return;
    }
    if (isDuplicate) {
      setMessage("This nickname is already in use.");
      return;
    }

    onSave(nickname); // 부모로 전달
  };

  return (
    <div className="nickname-wrapper" data-model-id="2002:1383">
      <header className="nickname-header">
        <Xbutton className="nickname-xbutton" onClick={onClose} />
      </header>

      <div className="nickname-title-frame">
        <p className="nickname-title-text">
          <span className="nickname-title-bold">
            닉네임 변경
            <br />
          </span>
          <span className="nickname-subtext">
            중복 체크 완료 후 Save 버튼을 눌러야 변경됩니다.
          </span>
        </p>
      </div>

      <div className="nickname-body">
        <div className="nickname-id-box">
          <UserUserCardId className="nickname-id-icon" />
          <input
            className={`nickname-placeholder ${
              nickname.length > 0 ? "nickname-active" : ""
            }`}
            type="text"
            value={nickname}
            placeholder="변경할 닉네임을 입력해 주세요"
            onChange={(e) => {
              setNickname(e.target.value);
              setChecked(false);
              setMessage("");
            }}
          />
          <div
            className={`nickname-check-button ${
              nickname.length > 0 ? "active" : ""
            }`}
            onClick={handleCheckDuplicate}
          >
            <div className="nickname-check-text">중복 체크</div>
          </div>
        </div>

        <div className="nickname-message">{message}</div>
      </div>

      <button className="nickname-save-button" onClick={handleSave}>
        <div className="nickname-save-text">Save</div>
      </button>
    </div>
  );
};

export default NicknameScreen;
