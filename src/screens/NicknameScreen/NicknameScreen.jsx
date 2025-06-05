import React, { useState } from "react";
import Xbutton from "../../icons/XButton/XButton";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import api from "../../api/instance";
import "./NicknameScreen.css";

export const NicknameScreen = ({ onClose, onSave }) => {
  const [nickname, setNickname] = useState("");
  const [checked, setChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckDuplicate = async () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setChecked(false);
      setIsDuplicate(false);
      setMessage("닉네임은 2 ~ 20자 내로 작성해야 합니다.");
      return;
    }
    try {
      const res = await api.get(`/user-service/check-nickname/${trimmed}`);
      const isTaken = res.data.data;
      setChecked(true);
      setIsDuplicate(isTaken);
      setMessage(
        isTaken ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다."
      );
    } catch {
      setChecked(false);
      setIsDuplicate(false);
      setMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleSave = () => {
    if (!checked) {
      setMessage("먼저 중복 확인을 진행해주세요.");
      return;
    }
    if (isDuplicate) {
      setMessage("중복된 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }
    onSave(nickname.trim());
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
              setIsDuplicate(false);
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

        {message && <div className="nickname-message">{message}</div>}
      </div>

      <button className="nickname-save-button" onClick={handleSave}>
        <div className="nickname-save-text">Save</div>
      </button>
    </div>
  );
};

export default NicknameScreen;
