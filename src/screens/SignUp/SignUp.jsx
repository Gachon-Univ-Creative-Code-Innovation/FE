import React, { useState } from "react";
import { Link } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import Component18 from "../../icons/Component18/Component18";
import InterfaceCheck from "../../icons/InterfaceCheck/InterfaceCheck";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./SignUp.css";

export const SignUp = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [realCode] = useState("123456");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const handleConfirmCode = () => {
    if (verificationCode === realCode) {
      setIsCodeValid(true);
      alert("인증에 성공했습니다.");
    } else {
      setIsCodeValid(false);
      alert("인증 코드가 일치하지 않습니다.");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setPasswordMessage("비밀번호는 최소 8자 이상이어야 합니다.");
    } else {
      setPasswordMessage("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmMessage("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmMessage("");
    }
  };

  const handleSendEmail = () => {
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }
    setEmailMessage("인증번호가 발송되었습니다.");
  };

  return (
    <PageTransitionWrapper>
      <Component18 className="component-18" />
      <div className="sign-up-screen">
        <div className="sign-up-2">
          <div className="frame">
            <div className="password">
              <UserIcon className="user-user" />
              <input
                type="text"
                placeholder="Enter your name"
                className="text-input"
              />
            </div>

            <div className="id">
              <UserUserCardId className="user-user-card-ID" />
              <input
                type="text"
                placeholder="Enter your nickname"
                className="text-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <div className={`frame-2 ${nickname ? "active" : ""}`}>
                <div className="text-wrapper-19">Check availability</div>
              </div>
            </div>

            <div className="password-2">
              <CommunicationMail className="user-user-card-ID" />
              <input
                type="email"
                placeholder="Enter your email"
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div
                className={`frame-2 ${email ? "active" : ""}`}
                onClick={handleSendEmail}
              >
                <div className="text-wrapper-19">Get certified</div>
              </div>
            </div>

            <div className="text-wrapper-22">{emailMessage}</div>

            <div className="password-3">
              <InterfaceCheck className="user-user-card-ID" />
              <input
                type="text"
                placeholder="Enter verification code"
                className="text-input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <div
                className={`frame-2 ${verificationCode ? "active" : ""}`}
                onClick={handleConfirmCode}
              >
                <div className="text-wrapper-19">Confirm</div>
              </div>
            </div>

            <div className="text-wrapper-23">{isCodeValid && "인증 성공"}</div>

            <div className="password-4">
              <LockLight1 className="lock-light-instance" />
              <input
                type="password"
                placeholder="Enter your password (At least 8 characters)"
                className="text-input"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="text-wrapper-24">{passwordMessage}</div>

            <div className="password-5">
              <LockLight1 className="lock-light-1" />
              <input
                type="password"
                placeholder="Re-enter your password"
                className="text-input"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>

            <div className="text-wrapper-25">{confirmMessage}</div>

            <div className="password-6">
              <InterfaceLinkHorizontal className="interface-link" />
              <input
                type="url"
                placeholder="Enter your GitHub URL (Optional)"
                className="text-input"
              />
            </div>

            <Link to="/login">
              <button className="login-button">
                <div className="LOGIN">Sign up</div>
              </button>
            </Link>
          </div>

          <Link to="/">
            <img
              className="alog-logo"
              alt="Alog logo"
              src="/img/alog-logo.png"
            />
          </Link>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default SignUp;
