import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommunicationLock from "../../icons/LockLight1/LockLight1"; // 비밀번호 아이콘
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./ResetPassword.css"; // 필요하다면 ForgotPassword.css를 복사해 클래스명만 변경해서 사용

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL 쿼리에서 token을 꺼냄
  const [token, setToken] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token") || "";
    setToken(t);
  }, [location.search]);

  // 새 비밀번호 상태
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 에러/안내 메시지 상태
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  // API 요청 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // “Reset Password” 버튼 클릭 처리
  const handleReset = async () => {
    // 비어 있거나 길이 부족 검사
    if (!newPassword) {
      setPasswordMessage("새 비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    // 확인 비밀번호 검사
    if (!confirmPassword) {
      setConfirmMessage("비밀번호 확인을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 토큰 유무 검사
    if (!token) {
      setResultMessage("유효한 토큰이 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setResultMessage("");
      setPasswordMessage("");
      setConfirmMessage("");

      // 실제 API 호출: /api/user-service/reset-password
      const response = await api.post("/api/user-service/reset-password", {
        token,
        newPassword,
      });

      if (response.status === 200) {
        setResultMessage(
          "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다."
        );
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        setResultMessage("입력값이 올바르지 않습니다. (최소 8자)");
      } else if (status === 401) {
        setResultMessage("유효하지 않거나 만료된 토큰입니다.");
      } else {
        setResultMessage(
          "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransitionWrapper>
      {/* 뒤로가기 아이콘 */}
      <GoBackIcon
        className="resetpassword-goback-icon"
        onClick={() => navigate(-1)}
      />

      <div className="resetpassword-wrapper">
        <div className="resetpassword-container">
          <div className="resetpassword-frame">
            <div className="resetpassword-placeholder-rectangle" />

            {/* 새 비밀번호 입력 */}
            <div className="resetpassword-newpw-wrapper">
              <div className="resetpassword-input-box">
                <CommunicationLock className="resetpassword-icon" />
                <input
                  type="password"
                  placeholder="새 비밀번호 입력 (최소 8자)"
                  className="resetpassword-input"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordMessage("");
                    setResultMessage("");
                  }}
                  disabled={isSubmitting}
                />
              </div>
              {passwordMessage && (
                <div className="resetpassword-message">{passwordMessage}</div>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="resetpassword-confirmpw-wrapper">
              <div className="resetpassword-input-box">
                <CommunicationLock className="resetpassword-icon" />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  className="resetpassword-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmMessage("");
                    setResultMessage("");
                  }}
                  disabled={isSubmitting}
                />
              </div>
              {confirmMessage && (
                <div className="resetpassword-message">{confirmMessage}</div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div
              className="resetpassword-submit-button"
              onClick={!isSubmitting ? handleReset : undefined}
              style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              <div className="resetpassword-submit-text">
                {isSubmitting ? "변경 중..." : "Reset Password"}
              </div>
            </div>

            {/* 결과 메시지 */}
            {resultMessage && (
              <div className="resetpassword-result-message">
                {resultMessage}
              </div>
            )}
          </div>

          {/* Alog 로고 */}
          <div className="resetpassword-logo-container">
            <AlogIcon className="resetpassword-logo" />
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ResetPassword;
