import React from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import ForgotUsername from "../../components/ForgotUsername/ForgotUsername";
import SignUp from "../../components/SignUp/SignUp";
import Component18 from "../../icons/Component18/Component18";
import Property1Unchecked from "../../icons/Property1Unchecked/Property1Unchecked";
import "./Loginstyle.css";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper"; // ✅ 애니메이션 래퍼 import

export const Login = () => {
  const navigate = useNavigate();

  return (
    <PageTransitionWrapper>
      <div className="login">
        <div className="div-2">
          <button className="login-button">
            <div className="LOGIN">LOGIN</div>
          </button>

          <div className="menu">
            <div className="overlap-group">
              <div className="sign-up-wrapper">
                <SignUp property1="default" />
              </div>

              <div className="forgot-username-wrapper">
                <ForgotUsername
                  className="forgot-username-instance"
                  property1="default"
                />
              </div>

              <div className="forgot-password-wrapper">
                <ForgotPassword property1="default" />
              </div>
            </div>
          </div>

          <div className="id">
            <div className="text-wrapper-3">id</div>
          </div>

          <div className="password">
            <div className="text-wrapper-3">password</div>
          </div>

          <div className="group">
            <div className="text-wrapper-4">Keep me logged in</div>
            <Property1Unchecked
              className="property-1-unchecked"
              color="#D9D9D9"
            />
          </div>

          <Component18 className="component-18" />

          <img
            className="alog-logo"
            alt="Alog logo"
            src="/img/alog-logo.png"
            onClick={() => navigate("/MainPageBefore")}
            style={{ cursor: "pointer" }}
          />

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
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Login;
