import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import InterfaceCheck from "../../icons/InterfaceCheck/InterfaceCheck";
import AlogIcon from "../../icons/AlogLogo/AlogLogo";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./ForgotPassword.css";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [realCode] = useState("123456");
  const [emailMessage, setEmailMessage] = useState("");
  const [codeMessage, setCodeMessage] = useState("");

  const handleSendEmail = () => {
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
    } else {
      setEmailMessage("인증번호가 발송되었습니다.");
    }
  };

  const handleConfirmCode = () => {
    if (code === realCode) {
      setCodeMessage("인증에 성공했습니다.");
    } else {
      setCodeMessage("인증 코드가 일치하지 않습니다.");
    }
  };

  const handleSubmit = () => {
    navigate("/login");
  };

  return (
    <PageTransitionWrapper>
      <GoBackIcon className="forgotpassword-goback-icon" />

      <div className="forgotpassword-wrapper">
        <div className="forgotpassword-container">
          <div className="forgotpassword-frame">
            <div className="forgotpassword-placeholder-rectangle" />

            {/* 이메일 입력 영역 */}
            <div className="forgotpassword-email-wrapper">
              <div className="forgotpassword-input-box">
                <CommunicationMail className="forgotpassword-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="forgotpassword-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div
                  className={`forgotpassword-button-wrapper ${
                    email ? "active" : ""
                  }`}
                  onClick={email ? handleSendEmail : undefined}
                >
                  <div className="forgotpassword-button-text">
                    Get certified
                  </div>
                </div>
              </div>
              <div className="forgotpassword-message">{emailMessage}</div>
            </div>

            {/* 인증코드 입력 영역 */}
            <div className="forgotpassword-code-wrapper">
              <div className="forgotpassword-input-box">
                <InterfaceCheck className="forgotpassword-icon" />
                <input
                  type="text"
                  placeholder="Enter verification code"
                  className="forgotpassword-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div
                  className={`forgotpassword-button-wrapper ${
                    code ? "active" : ""
                  }`}
                  onClick={code ? handleConfirmCode : undefined}
                >
                  <div className="forgotpassword-button-text">Confirm</div>
                </div>
              </div>
              <div className="forgotpassword-message">{codeMessage}</div>
            </div>

            {/* 제출 버튼 */}
            <div
              className="forgotpassword-submit-button"
              onClick={handleSubmit}
              style={{ cursor: "pointer" }}
            >
              <div className="forgotpassword-submit-text">Reset Password</div>
            </div>
          </div>
          <div
            onClick={() => navigate("/MainPageBefore")}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 55,
              left: 620,
            }}
          >
            <AlogIcon width={200} height={80} />
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ForgotPassword;
