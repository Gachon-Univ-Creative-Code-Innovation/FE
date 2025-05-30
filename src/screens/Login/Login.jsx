// src/screens/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import SignUp from "../../components/SignUp/SignUp";
import SelectMode from "../../screens/SelectMode/SelectMode";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import Property1Unchecked from "../../icons/PropertyUnchecked/PropertyUnchecked";
import AlogLogo from "../../icons/AlogLogo/AlogLogo";
import SocialKakao from "./SocialKakao";
import "./Login.css";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import { AnimatePresence } from "framer-motion";
import api from "../../api/instance";

export const Login = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="login-id">
              <input
                type="text"
                className="login-text-input"
                placeholder="ID"
                autoComplete="off"
                value={id}
                onChange={(e) => setId(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="login-password">
              <input
                type="password"
                className="login-text-input"
                placeholder="PASSWORD"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              type="button"
              className="login-button"
              onClick={handleLogin}
            >
              <div className="login-LOGIN">LOGIN</div>
            </button>
          </form>

          {errorMessage && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {errorMessage}
            </div>
          )}

          <div className="login-menu">
            <div className="login-overlap-group">
              <div className="login-sign-up-wrapper">
                <div onClick={openModal}>
                  <SignUp property1="default" />
                </div>
              </div>
              <div className="login-forgot-password-wrapper">
                <div
                  onClick={() => navigate("/forgotpassword")}
                  style={{ cursor: "pointer" }}
                >
                  <ForgotPassword property1="default" />
                </div>
              </div>
            </div>
          </div>

          <div className="login-group">
            <div className="login-text-wrapper-4">Keep me logged in</div>
            <Property1Unchecked
              className="login-property-1-unchecked"
              color="#D9D9D9"
            />
          </div>

          <div
            onClick={() => navigate("/MainPageBefore")}
            style={{ cursor: "pointer" }}
          >
            <AlogLogo className="login-alog-logo" width={200} height={80} />
          </div>

          <div className="login-frame">
            {/* 카카오 소셜 로그인 버튼 */}
            <SocialKakao />

            {/* 기존 구글 로그인 버튼 */}
            <div className="login-web-light-rd-na">
              <img
                className="login-google-round"
                alt="google-round"
                src="/img/google-round.svg"
              />
              <img
                className="login-clip-path-group"
                alt="Clip path group"
                src="/img/google-logo.png"
              />
            </div>
          </div>

          <AnimatePresence>
            <SelectMode isOpen={showModal} onClose={closeModal} />
          </AnimatePresence>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Login;
