import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommunicationLock from "../../icons/LockLight1/LockLight1";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import AlogIcon from "../../icons/AlogLogo/AlogLogo";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./ResetPassword.css";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "");
  }, [location.search]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 비밀번호 유효성 검사 (실시간)
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setResultMessage("");
    
    if (value.length === 0) {
      setPasswordMessage("");
    } else if (value.length < 8) {
      setPasswordMessage("비밀번호는 최소 8자 이상이어야 합니다.");
    } else {
      setPasswordMessage("사용 가능한 비밀번호입니다.");
    }
    
    // 비밀번호 확인과의 일치 여부 체크
    if (confirmPassword && value !== confirmPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmMessage("비밀번호가 일치합니다.");
    }
  };

  // 비밀번호 확인 유효성 검사 (실시간)
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setResultMessage("");
    
    if (value.length === 0) {
      setConfirmMessage("");
    } else if (value !== newPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmMessage("비밀번호가 일치합니다.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setPasswordMessage("새 비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (!confirmPassword) {
      setConfirmMessage("비밀번호 확인을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!token) {
      setResultMessage("유효한 토큰이 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setResultMessage("");

      const response = await api.post("/user-service/reset-password", {
        token,
        newPassword,
      });

      if (response.status === 200) {
        setResultMessage(
          "비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다."
        );
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        const detail = error.response.data?.data;
        setResultMessage(
          Array.isArray(detail) && detail.length > 0
            ? detail[0]
            : "입력값이 올바르지 않습니다."
        );
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

  // 버튼 활성화 조건 계산
  const isFormValid = 
    token &&
    newPassword.length >= 8 &&
    confirmPassword &&
    newPassword === confirmPassword;

  return (
    <PageTransitionWrapper>
      <GoBackIcon className="resetpassword-component-18" onClick={() => navigate(-1)} />

      <div className="resetpassword">
        <div className="resetpassword-div-2">
          {/* 왼쪽 영역 - 로고 */}
          <div className="resetpassword-left-section">
            <div className="resetpassword-left-content">
              <div className="resetpassword-logo-container">
                <img
                  src="/img/AlOG-logo.png"
                  alt="Alog Logo"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 영역 - 비밀번호 재설정 폼 */}
          <div className="resetpassword-right-section">
            <form autoComplete="off" onSubmit={handleReset}>
              {/* 화면에 보이지 않지만 autofill을 위해 필요한 username 필드 */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                hidden
              />

              <div className="resetpassword-title">
                <h2>비밀번호 재설정</h2>
                <p>새로운 비밀번호를 입력해주세요.</p>
              </div>

              {/* 새 비밀번호 입력 필드 */}
              <div className="resetpassword-password">
                <input
                  type="password"
                  name="new-password"
                  autoComplete="new-password"
                  placeholder="새 비밀번호 입력 (최소 8자)"
                  className="resetpassword-text-input"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
              </div>
              {passwordMessage && (
                <div className={`resetpassword-message ${
                  passwordMessage.includes("사용 가능한") ? "success" : "error"
                }`}>
                  {passwordMessage}
                </div>
              )}

              {/* 비밀번호 확인 입력 필드 */}
              <div className="resetpassword-password">
                <input
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  placeholder="비밀번호 확인"
                  className="resetpassword-text-input"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={isSubmitting}
                />
              </div>
              {confirmMessage && (
                <div className={`resetpassword-message ${
                  confirmMessage.includes("일치합니다") ? "success" : "error"
                }`}>
                  {confirmMessage}
                </div>
              )}

              {/* 결과 메시지 */}
              {resultMessage && (
                <div className={`resetpassword-message ${resultMessage.includes("변경되었습니다") ? "success" : "error"}`}>
                  {resultMessage}
                </div>
              )}

              {/* 재설정 버튼 */}
              <button
                type="submit"
                className={`resetpassword-button ${isFormValid ? "active" : ""}`}
                disabled={isSubmitting || !isFormValid}
                style={{
                  cursor: isSubmitting || !isFormValid ? "not-allowed" : "pointer",
                  opacity: isSubmitting || !isFormValid ? 0.5 : 1,
                }}
              >
                <div className="resetpassword-submit-text">
                  {isSubmitting ? "변경 중..." : "비밀번호 재설정"}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ResetPassword; 