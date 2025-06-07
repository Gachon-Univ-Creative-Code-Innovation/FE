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
      <GoBackIcon className="forgotpassword-goback-icon" onClick={() => navigate(-1)} />

      <div className="forgotpassword">
        <div className="forgotpassword-div-2">
          {/* 왼쪽 영역 - 로고 */}
          <div className="forgotpassword-left-section">
            <div className="forgotpassword-left-content">
              <div className="forgotpassword-logo-container">
                <img
                  src="/img/AlOG-logo.png"
                  alt="Alog Logo"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 영역 - 비밀번호 찾기 폼 */}
          <div className="forgotpassword-right-section">
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <div className="forgotpassword-title">
                <h2>비밀번호를 잊으셨나요?</h2>
                <p>가입하신 이메일 주소를 입력해주세요.</p>
              </div>

              {/* 이메일 입력 필드 */}
              <div className="forgotpassword-email">
                <CommunicationMail />
                <input
                  type="email"
                  className="forgotpassword-text-input"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailMessage("");
                  }}
                  disabled={isSending}
                />
              </div>

              {/* 안내 메시지 */}
              {emailMessage && (
                <div className={`forgotpassword-message ${emailMessage.includes("발송") ? "success" : "error"}`}>
                  {emailMessage}
                </div>
              )}

              {/* 인증 메일 발송 버튼 */}
              <button
                type="button"
                className="forgotpassword-button"
                onClick={handleSendEmail}
                disabled={isSending || !email}
                style={{
                  cursor: isSending || !email ? "not-allowed" : "pointer",
                  opacity: isSending || !email ? 0.5 : 1,
                }}
              >
                <div className="forgotpassword-button-text">
                  {isSending ? "요청 중..." : "인증 메일 발송"}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ForgotPassword;
