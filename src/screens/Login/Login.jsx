import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import SignUp from "../../components/SignUp/SignUp";
import SelectMode from "../../screens/SelectMode/SelectMode";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import Property1Unchecked from "../../icons/PropertyUnchecked/PropertyUnchecked";
import AlogLogo from "../../icons/AlogLogo/AlogLogo";
import "./Login.css";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import { AnimatePresence } from "framer-motion";

export const Login = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dummyUser = {
    id: "test",
    password: "1234",
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleLogin = () => {
    if (id === dummyUser.id && password === dummyUser.password) {
      navigate("/MainPageAfter");
    } else {
      setErrorMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <PageTransitionWrapper>
      <Component18 className="component-18" />
      <div className="login">
        <div className="div-2">
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="id">
              <input
                type="text"
                className="text-input"
                placeholder="Id"
                autoComplete="off"
                value={id}
                onChange={(e) => setId(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="password">
              <input
                type="password"
                className="text-input"
                placeholder="password"
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
              <div className="LOGIN">LOGIN</div>
            </button>
          </form>

          {errorMessage && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {errorMessage}
            </div>
          )}

          <div className="menu">
            <div className="overlap-group">
              <div className="sign-up-wrapper">
                <div onClick={openModal}>
                  <SignUp property1="default" />
                </div>
              </div>

              <div className="forgot-username-wrapper"></div>

              <div className="forgot-password-wrapper">
                {/* ✅ 클릭 시 /forgotpassword 페이지로 이동 */}
                <div
                  onClick={() => navigate("/forgotpassword")}
                  style={{ cursor: "pointer" }}
                >
                  <ForgotPassword property1="default" />
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="text-wrapper-4">Keep me logged in</div>
            <Property1Unchecked
              className="property-1-unchecked"
              color="#D9D9D9"
            />
          </div>

          <div
            onClick={() => navigate("/MainPageBefore")}
            style={{ cursor: "pointer" }}
          >
            <AlogLogo className="alog-logo" width={200} height={80} />
          </div>

          <div className="frame">
            <img
              className="element-kakaotalk-logo"
              alt="Element kakaotalk logo"
              src="/img/kakaotalk-logo.png"
            />
            <div className="web-light-rd-na">
              <img
                className="google-round"
                alt="google-round"
                src="/img/google-round.svg"
              />
              <img
                className="clip-path-group"
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
