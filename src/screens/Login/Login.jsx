import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import SignUp from "../../components/SignUp/SignUp";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import Property1Unchecked from "../../icons/PropertyUnchecked/PropertyUnchecked";
import SocialKakao from "./SocialKakao";
import SocialGoogle from "./SocialGoogle";
import "./Login.css";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import { AnimatePresence } from "framer-motion";
import api from "../../api/instance";

export const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const response = await api.post("/user-service/signin", {
        email: id,
        password: password,
      });

      const { accessToken, refreshToken, userId } = response.data.data;
      localStorage.setItem("jwtToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (userId) localStorage.setItem("userId", userId);
      window.location.href = "/MainPageAfter";
    } catch (error) {
      const message = error.response?.data?.message || "로그인에 실패했습니다.";
      setErrorMessage(message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <PageTransitionWrapper>
      <GoBackIcon className="login-component-18" />

      <div className="login">
        <div className="login-div-2">
          {/* 왼쪽 영역 - 로고와 회원가입 */}
          <div className="login-left-section">
            <div className="login-left-content">
              <div className="login-logo-container">
                <img
                  src="/img/AlOG-logo.png"
                  alt="Alog Logo"
                  
                />
              </div>
              
            </div>
          </div>

          {/* 오른쪽 영역 - 로그인 폼 */}
          <div className="login-right-section">
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              {/* ID 입력 필드 */}
              <div className="login-id">
                <input
                  type="text"
                  className="login-text-input"
                  placeholder="이메일"
                  autoComplete="off"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* 비밀번호 입력 필드 */}
              <div className="login-password">
                <input
                  type="password"
                  className="login-text-input"
                  placeholder="비밀번호"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* 로그인 유지 체크박스와 회원가입, 비밀번호 찾기 */}
              <div className="login-keep-sign-up-forgot-group">
                <div className="login-keep-logged-in">
                  <Property1Unchecked
                    className="login-property-1-unchecked"
                    color="#D9D9D9"
                  />
                  <div className="login-text-wrapper-4">로그인 유지</div>
                </div>
                <div className = "login-sign-up-forgot-group">
                  <div className="login-signup">
                    <div 
                    onClick={() => navigate("/signup")}
                    style={{ cursor: "pointer" }}
                    >
                      <SignUp property1="default" />
                    </div>
                  </div>
                  <div className="login-forgot-password">
                    <div
                      onClick={() => navigate("/forgotpassword")}
                      style={{ cursor: "pointer" }}
                    >
                      <ForgotPassword property1="default" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 에러 메시지 */}
              {errorMessage && (
                <div className="login-error-message">{errorMessage}</div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="button"
                className="login-button"
                onClick={handleLogin}
              >
                <div className="login-LOGIN">로그인</div>
              </button>
            </form>

            {/* 소셜 로그인 버튼들 */}
            <div className="login-frame">
              <SocialKakao />
              <SocialGoogle />
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Login;