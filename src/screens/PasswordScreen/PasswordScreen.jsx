import React, { useState } from "react";
import Xbutton from "../../icons/XButton/XButton";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import "./PasswordScreen.css";

export const PasswordScreen = ({ onClose, onSave }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");

  const handleSave = () => {
    let valid = true;

    if (password.length < 8) {
      setMessage1("Your password must be at least 8 characters long.");
      valid = false;
    } else {
      setMessage1("");
    }

    if (password !== confirm) {
      setMessage2("The passwords you entered do not match.");
      valid = false;
    } else {
      setMessage2("");
    }

    if (valid) {
      onSave(password);
    }
  };

  return (
    <div className="passwordscreen-wrapper">
      <header className="passwordscreen-header">
        <Xbutton className="passwordscreen-x-button" onClick={onClose} />
      </header>

      <div className="passwordscreen-title-wrapper">
        <p className="passwordscreen-title-text">
          <span className="passwordscreen-title-bold">
            비밀번호 변경
            <br />
          </span>
          <span className="passwordscreen-subtext">
            입력 후 Save 버튼을 눌러야 변경됩니다.
          </span>
        </p>
      </div>

      <div className="passwordscreen-body">
        <div className="passwordscreen-input-box">
          <LockLight1 className="passwordscreen-icon" />
          <input
            className="passwordscreen-placeholder"
            type="password"
            placeholder="새 비밀번호를 입력해 주세요 (최소 8자리 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="passwordscreen-message">{message1}</div>

        <div className="passwordscreen-input-box">
          <LockLight1 className="passwordscreen-icon" />
          <input
            className="passwordscreen-placeholder"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <div className="passwordscreen-message">{message2}</div>
      </div>

      <button className="passwordscreen-save-button" onClick={handleSave}>
        <div className="passwordscreen-save-text">Save</div>
      </button>
    </div>
  );
};

export default PasswordScreen;
