import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import AlogIcon from "../../icons/AlogLogo/AlogLogo";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";

import "./ForgotPassword.css";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [email, setEmail] = useState(""); // 입력된 이메일
  const [emailMessage, setEmailMessage] = useState(""); // 안내 메시지
  const [isSending, setIsSending] = useState(false); // API 요청 중 여부

  // 비밀번호 재설정 메일 요청
  const handleSendEmail = async () => {
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      setEmailMessage("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsSending(true);

      const response = await api.post("/user-service/reset-password-request", {
        email,
      });
      if (response.status === 200) {
        setEmailMessage(
          "비밀번호 재설정 링크가 담긴 메일이 발송되었습니다. 메일함을 확인해주세요."
        );
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        setEmailMessage("입력값이 올바르지 않습니다.");
      } else if (status === 404) {
        setEmailMessage("등록되지 않은 이메일입니다.");
      } else {
        setEmailMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageTransitionWrapper>
      {/* 뒤로가기 아이콘 */}
      <GoBackIcon
        className="forgotpassword-goback-icon"
        onClick={() => navigate(-1)}
      />

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailMessage(""); // 입력 변경 시 메시지 초기화
                  }}
                  disabled={isSending}
                />
                <div
                  className={`forgotpassword-button-wrapper ${
                    email && !isSending ? "active" : ""
                  }`}
                  onClick={!isSending && email ? handleSendEmail : undefined}
                  style={{
                    cursor: email && !isSending ? "pointer" : "not-allowed",
                  }}
                >
                  <div className="forgotpassword-button-text">
                    {isSending ? "요청 중..." : "Get certified"}
                  </div>
                </div>
              </div>
              {/* 안내 메시지 */}
              <div className="forgotpassword-message">{emailMessage}</div>
            </div>
          </div>

          {/* Alog 로고 */}
          <div className="forgotpassword-logo-container">
            <AlogIcon
              className="forgotpassword-logo"
              onClick={() => navigate("/mainpagebefore")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ForgotPassword;
