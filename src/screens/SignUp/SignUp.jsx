import React, { useState } from "react";
import { Link } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import InterfaceCheck from "../../icons/InterfaceCheck/InterfaceCheck";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import AlogLogo from "../../icons/AlogLogo/AlogLogo";
import "./SignUp.css";
import api from "../../api/instance";

export const SignUp = () => {
  // 입력 상태
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 메시지 상태
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // 플래그
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }
    try {
      const res = await api.get(`/user-service/check-nickname/${nickname}`);
      if (res.data.data) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      }
    } catch {
      setNicknameMessage("닉네임 확인 실패");
      setIsNicknameChecked(false);
    }
  };

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }
    try {
      await api.post("/user-service/verify/send", { email });
      setEmailMessage("인증번호 발송 완료");
    } catch {
      setEmailMessage("인증번호 발송 실패");
    }
  };

  // 인증번호 확인
  const handleConfirmCode = async () => {
    if (!email || !verificationCode) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }
    try {
      await api.post("/user-service/verify/check", {
        email,
        code: verificationCode,
      });
      setIsCodeValid(true);
      alert("인증 성공");
    } catch {
      setIsCodeValid(false);
      alert("인증 실패");
    }
  };

  // 비밀번호 입력 변화
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMessage(value.length < 8 ? "비밀번호 8자 이상" : "");
    if (confirmPassword && value !== confirmPassword) {
      setConfirmMessage("비밀번호 불일치");
    } else {
      setConfirmMessage("");
    }
  };

  // 비밀번호 재입력 변화
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmMessage(value !== password ? "비밀번호 불일치" : "");
  };

  // 회원가입
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isNicknameChecked) {
      alert("닉네임 중복 확인 필요");
      return;
    }
    if (!isCodeValid) {
      alert("이메일 인증 필요");
      return;
    }
    if (password.length < 8) {
      setPasswordMessage("비밀번호 8자 이상");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmMessage("비밀번호 불일치");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);
      formData.append("nickname", nickname);
      formData.append("role", "USER");
      await api.post("/user-service/signup", formData);
      alert("회원가입 완료");
      window.location.href = "/login";
    } catch {
      alert("회원가입 실패");
    }
  };

  // 버튼 활성화 여부
  const isFormValid =
    isNicknameChecked &&
    isCodeValid &&
    password.length >= 8 &&
    password === confirmPassword;

  return (
    <PageTransitionWrapper>
      <Component18 className="sign-up-screen component-18" />
      <div className="sign-up-screen">
        <div className="sign-up-2">
          <div className="frame">
            {/* 이름 */}
            <div className="password">
              <UserIcon className="user-user" />
              <input
                type="text"
                placeholder="Enter your name"
                className="text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 닉네임 + 중복 확인 */}
            <div className="id">
              <UserUserCardId className="user-user-card-ID" />
              <input
                type="text"
                placeholder="Enter your nickname"
                className="text-input"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameChecked(false);
                  setNicknameMessage("");
                }}
              />
              <div
                className={`frame-2 ${
                  nickname && !isNicknameChecked ? "active" : ""
                }`}
                onClick={() => {
                  if (!isNicknameChecked) handleCheckNickname();
                }}
                style={{
                  cursor: isNicknameChecked ? "not-allowed" : "pointer",
                  opacity: isNicknameChecked ? 0.5 : 1,
                }}
              >
                <div className="text-wrapper-19">중복 확인</div>
              </div>
            </div>
            {nicknameMessage && (
              <div className="text-wrapper-21">{nicknameMessage}</div>
            )}

            {/* 이메일 + 인증번호 발송 */}
            <div className="password-2">
              <CommunicationMail className="user-user-card-ID" />
              <input
                type="email"
                placeholder="Enter your email"
                className="text-input"
                value={email}
                disabled={isCodeValid}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div
                className={`frame-2 ${email && !isCodeValid ? "active" : ""}`}
                onClick={() => {
                  if (!isCodeValid) handleSendEmail();
                }}
                style={{
                  cursor: isCodeValid ? "not-allowed" : "pointer",
                  opacity: isCodeValid ? 0.5 : 1,
                }}
              >
                <div className="text-wrapper-19">Get certified</div>
              </div>
            </div>
            <div className="text-wrapper-22">{emailMessage}</div>

            {/* 인증번호 입력 + 확인 */}
            <div className="password-3">
              <InterfaceCheck className="user-user-card-ID" />
              <input
                type="text"
                placeholder="Enter verification code"
                className="text-input"
                value={verificationCode}
                disabled={isCodeValid}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <div
                className={`frame-2 ${
                  verificationCode && !isCodeValid ? "active" : ""
                }`}
                onClick={() => {
                  if (!isCodeValid) handleConfirmCode();
                }}
                style={{
                  cursor: isCodeValid ? "not-allowed" : "pointer",
                  opacity: isCodeValid ? 0.5 : 1,
                }}
              >
                <div className="text-wrapper-19">Confirm</div>
              </div>
            </div>
            <div className="text-wrapper-23">{isCodeValid && "인증 성공"}</div>

            {/* 비밀번호 */}
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

            {/* 비밀번호 확인 */}
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

            {/* GitHub URL(선택) */}
            <div className="password-6">
              <InterfaceLinkHorizontal className="interface-link" />
              <input
                type="url"
                placeholder="Enter your GitHub URL (Optional)"
                className="text-input"
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              className="login-button"
              onClick={handleSignUp}
              disabled={!isFormValid}
              style={{
                cursor: !isFormValid ? "not-allowed" : "pointer",
                opacity: !isFormValid ? 0.5 : 1,
              }}
            >
              <div className="LOGIN">Sign up</div>
            </button>
          </div>

          {/* 홈으로 */}
          <Link to="/">
            <AlogLogo className="alog-logo" width={200} height={80} />
          </Link>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default SignUp;
