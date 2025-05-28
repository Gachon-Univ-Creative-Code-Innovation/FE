import React, { useState } from "react";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import InterfaceCheck from "../../icons/InterfaceCheck/InterfaceCheck";
import Xbutton from "../../icons/XButton/XButton";
import "./EmailScreen.css";

export const EmailScreen = ({ onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [codeMessage, setCodeMessage] = useState("");

  const handleSendCode = () => {
    if (!email.includes("@")) {
      setEmailMessage("Please enter a valid email address.");
    } else {
      setEmailMessage("A verification code has been sent to your email.");
    }
  };

  const handleVerifyCode = () => {
    if (code === "123456") {
      setCodeMessage("Your verification was successful.");
    } else {
      setCodeMessage("The verification code does not match.");
    }
  };

  const handleSave = () => {
    if (!email.includes("@")) {
      setEmailMessage("Please enter a valid email address.");
      return;
    }

    if (code !== "123456") {
      setCodeMessage("The verification code does not match.");
      return;
    }

    onSave(email); // 부모로 이메일 전달
  };

  return (
    <div className="emailscreen-wrapper" data-model-id="2002:1363">
      <header className="emailscreen-x-button-wrapper">
        <Xbutton className="emailscreen-icon" onClick={onClose} />
      </header>

      <div className="emailscreen-title-wrapper">
        <p className="emailscreen-title-text">
          <span className="emailscreen-title-bold">
            E-mail 변경
            <br />
          </span>
          <span className="emailscreen-subtext">
            인증 완료 후 Save 버튼을 눌러야 변경됩니다.
          </span>
        </p>
      </div>

      <div className="emailscreen-body">
        {/* 이메일 입력 */}
        <div className="emailscreen-input-box">
          <CommunicationMail className="emailscreen-icon" />
          <input
            className="emailscreen-placeholder"
            type="text"
            placeholder="새 email을 입력해 주세요"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailMessage("");
            }}
          />
          <div
            className={`emailscreen-button-frame ${
              email.length > 0 ? "active" : ""
            }`}
            onClick={handleSendCode}
            style={{ cursor: email.length > 0 ? "pointer" : "default" }}
          >
            <div className="emailscreen-button-text">인증번호 전송</div>
          </div>
        </div>
        <div className="emailscreen-message">{emailMessage}</div>

        {/* 인증번호 입력 */}
        <div className="emailscreen-input-box">
          <InterfaceCheck className="emailscreen-icon" />
          <input
            className="emailscreen-placeholder"
            type="text"
            placeholder="인증번호를 입력해 주세요"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCodeMessage("");
            }}
          />
          <div
            className={`emailscreen-button-frame ${
              code.length > 0 ? "active" : ""
            }`}
            onClick={handleVerifyCode}
            style={{ cursor: code.length > 0 ? "pointer" : "default" }}
          >
            <div className="emailscreen-button-text">인증하기</div>
          </div>
        </div>
        <div className="emailscreen-message">{codeMessage}</div>
      </div>

      <button className="emailscreen-save-button" onClick={handleSave}>
        <div className="emailscreen-save-text">Save</div>
      </button>
    </div>
  );
};

export default EmailScreen;
