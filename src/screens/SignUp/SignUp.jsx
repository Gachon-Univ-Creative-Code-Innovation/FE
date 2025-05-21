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
  const [name, setName] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");

  const handleConfirmCode = async () => {
    if (!email || !verificationCode) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }
    try {
      await api.post("/user-service/verify/check", { email, code: verificationCode });
      setIsCodeValid(true);
      alert("인증에 성공했습니다.");
    } catch (error) {
      setIsCodeValid(false);
      alert(error.response?.data?.message || "인증에 실패했습니다.");
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

  const handleSendEmail = async () => {
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }
    try {
      await api.post("/user-service/verify/send", { email });
      setEmailMessage("인증번호가 발송되었습니다.");
    } catch (error) {
      setEmailMessage(error.response?.data?.message || "인증번호 발송에 실패했습니다.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 회원가입 API 요청
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);
      formData.append("nickname", nickname);
      formData.append("role", "USER"); // 기본값 USER, 필요시 선택값으로 변경
      // githubUsername, profileImage 등 추가 가능

      await api.post("/user-service/signup", formData);
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  // 닉네임 중복 확인 함수
  const handleCheckNickname = async () => {
    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }
    try {
      const res = await api.get(`/user-service/check-nickname/${nickname}`);
      if (res.data.data === true) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      setNicknameMessage(error.response?.data?.message || "닉네임 중복 확인에 실패했습니다.");
    }
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <div
                className={`frame-2 ${nickname ? "active" : ""}`}
                onClick={handleCheckNickname}
                style={{ cursor: "pointer" }}
              >
                <div className="text-wrapper-19">중복 확인</div>
              </div>
            </div>
            {nicknameMessage && (
              <div className="text-wrapper-21">{nicknameMessage}</div>
            )}

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

            <button className="login-button" onClick={handleSignUp}>
              <div className="LOGIN">Sign up</div>
            </button>
          </div>

          <Link to="/">
            <AlogLogo className="alog-logo" width={200} height={80} />
          </Link>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default SignUp;
