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
      setPasswordMessage("");
      setConfirmMessage("");

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

  return (
    <PageTransitionWrapper>
      <GoBackIcon
        className="resetpassword-goback-icon"
        onClick={() => navigate(-1)}
      />

      <div className="resetpassword-wrapper">
        <div className="resetpassword-container">
          <div className="resetpassword-frame">
            <div className="resetpassword-placeholder-rectangle" />

            <form onSubmit={handleReset}>
              {/* 화면에 보이지 않지만 autofill을 위해 필요한 username 필드 */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                hidden
              />

              <div className="resetpassword-newpw-wrapper">
                <div className="resetpassword-input-box">
                  <CommunicationLock className="resetpassword-icon" />
                  <input
                    type="password"
                    name="new-password"
                    autoComplete="new-password"
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

              <div className="resetpassword-confirmpw-wrapper">
                <div className="resetpassword-input-box">
                  <CommunicationLock className="resetpassword-icon" />
                  <input
                    type="password"
                    name="confirm-password"
                    autoComplete="new-password"
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

              {resultMessage && (
                <div className="resetpassword-result-message">
                  {resultMessage}
                </div>
              )}

              <button
                type="submit"
                className="resetpassword-submit-button"
                disabled={isSubmitting}
              >
                <div className="resetpassword-submit-text">
                  {isSubmitting ? "변경 중..." : "비밀번호 재설정"}
                </div>
              </button>
            </form>
          </div>

          <div className="resetpassword-logo-container">
            <AlogIcon
              className="resetpassword-logo"
              onClick={() => navigate("/mainpagebefore")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default ResetPassword;
