// src/SignUp/SignUp.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import InterfaceCheck from "../../icons/InterfaceCheck/InterfaceCheck";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  // 현재 단계 인덱스: 0, 1, 2
  const [step, setStep] = useState(0);

  // STEP 0: 이름·닉네임·약관 동의 상태
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // STEP 1: 이메일·인증 코드·비밀번호 상태
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState(""); // HEAD에서 추가
  const [verificationCode, setVerificationCode] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(""); // HEAD에서 추가
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // STEP 2: GitHub URL & Profile Image 상태
  const [githubLink, setGithubLink] = useState("");

  // 전체 오류 메시지
  const [errorMessage, setErrorMessage] = useState("");

  // STEP 0: 닉네임 중복 확인 (HEAD의 개선된 로직 적용)
  const handleCheckNickname = async () => {
    setNicknameMessage("");
    setIsNicknameValid(false);

    if (!nickname.trim()) {
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }
    
    try {
      const res = await api.get(`/user-service/check-nickname/${nickname}`);
      if (res.data.data === true) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameValid(false);
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setIsNicknameValid(true);
      }
    } catch (err) {
      setNicknameMessage(err.response?.data?.message || "닉네임 중복 확인에 실패했습니다.");
      setIsNicknameValid(false);
    }
  };

  // STEP 1: 이메일 인증번호 발송 (HEAD의 개선된 에러 처리 적용)
  const handleSendEmail = async () => {
    setEmailMessage("");
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }
    
    try {
      await api.post("/user-service/verify/send", { email });
      setEmailMessage("인증번호가 발송되었습니다.");
    } catch (err) {
      setEmailMessage(err.response?.data?.message || "인증번호 발송에 실패했습니다.");
    }
  };

  // STEP 1: 인증 코드 확인 (HEAD의 개선된 에러 처리 적용)
  const handleConfirmCode = async () => {
    setErrorMessage("");
    setCodeMessage("");
    
    if (!email.trim() || !verificationCode.trim()) {
      setCodeMessage("이메일과 인증번호를 입력해주세요.");
      return;
    }
    
    try {
      await api.post("/user-service/verify/check", {
        email,
        code: verificationCode,
      });
      setIsCodeValid(true);
      setCodeMessage("인증에 성공했습니다.");
    } catch (err) {
      setIsCodeValid(false);
      setCodeMessage(err.response?.data?.message || "인증에 실패했습니다.");
    }
  };

  // STEP 1: 비밀번호 유효성 검사 (HEAD의 개선된 메시지 적용)
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value.length < 8) {
      setPasswordMessage("비밀번호는 최소 8자 이상이어야 합니다.");
    } else {
      setPasswordMessage("");
    }
    
    // 비밀번호 확인과의 일치 여부 체크
    if (confirmPassword && value !== confirmPassword) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmMessage("");
    }
  };

  // 비밀번호 재입력 변화 (HEAD의 개선된 메시지 적용)
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value !== password) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmMessage("");
    }
  };

  // STEP 2: 최종 회원가입 API 호출 (HEAD의 FormData 로직 적용)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("name", name.trim());
      formData.append("password", password);
      formData.append("nickname", nickname.trim());
      formData.append("role", "USER");
      
      if (githubLink.trim()) {
        formData.append("githubUsername", githubLink.trim());
      }

      await api.post("/user-service/signup", formData);
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  // 다음 단계로 이동 (개선된 유효성 검사)
  const handleNext = () => {
    setErrorMessage("");
    
    if (step === 0) {
      // STEP 0: 이름·닉네임·약관 검증
      if (!name.trim() || !nickname.trim()) {
        setErrorMessage("이름과 닉네임을 입력해주세요.");
        return;
      }
      if (!isNicknameValid || nicknameMessage === "이미 사용 중인 닉네임입니다.") {
        setErrorMessage("닉네임 중복 확인을 완료해주세요.");
        return;
      }
      if (!termsChecked || !privacyChecked) {
        setErrorMessage("약관 및 개인정보 수집 동의가 필요합니다.");
        return;
      }
    }
    
    if (step === 1) {
      // STEP 1: 이메일·인증·비밀번호 검증
      if (!email.includes("@")) {
        setErrorMessage("유효한 이메일을 입력해주세요.");
        return;
      }
      if (!isCodeValid) {
        setErrorMessage("이메일 인증을 완료해주세요.");
        return;
      }
      if (password.length < 8) {
        setErrorMessage("비밀번호는 최소 8자 이상이어야 합니다.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        return;
      }
    }
    
    if (step === 2) {
      // STEP 2: GitHub URL 검증 (선택 사항)
      if (githubLink.trim() && !githubLink.startsWith("https://github.com/")) {
        setErrorMessage("올바른 GitHub URL을 입력해주세요. (예: https://github.com/username)");
        return;
      }
    }
    
    setStep(step + 1);
  };

  // 이전 단계로 돌아가기
  const handleBack = () => {
    setErrorMessage("");
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  // 렌더링할 단계 내용
  const renderStepContent = () => {
    switch (step) {
      case 0: {
        // STEP 0 유효성 여부 계산
        const isStep0Valid =
          name.trim() &&
          nickname.trim() &&
          isNicknameValid &&
          termsChecked &&
          privacyChecked &&
          nicknameMessage !== "이미 사용 중인 닉네임입니다.";

        return (
          <>
            <div className="signup-right-top-section">
              {/* STEP 0: 이름 입력 */}
              <div className="signup-input">
                <UserIcon />
                <input
                  type="text"
                  className="signup-text-input"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* STEP 0: 닉네임 입력 & 중복 확인 */}
              <div className="signup-input with-button">
                <UserUserCardId />
                <input
                  type="text"
                  className="signup-text-input"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameMessage("");
                    setIsNicknameValid(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  className={
                    nickname.trim() && !isNicknameValid 
                      ? "signup-button-sm active" 
                      : "signup-button-sm"
                  }
                  disabled={isNicknameValid}
                  style={{
                    cursor: isNicknameValid ? "not-allowed" : "pointer",
                    opacity: isNicknameValid ? 0.5 : 1,
                  }}
                >
                  중복 확인
                </button>
              </div>
              {nicknameMessage && (
                <div
                  className={
                    isNicknameValid
                      ? "signup-success-message"
                      : "signup-error-message"
                  }
                >
                  {nicknameMessage}
                </div>
              )}

              {/* 약관 동의 체크박스 */}
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                  />
                  <label htmlFor="termsCheckbox">
                    <Link to="/signup/terms" target="_blank" rel="noopener noreferrer">
                      서비스 이용약관
                    </Link>
                    에 동의합니다.
                  </label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="privacyCheckbox"
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                  />
                  <label htmlFor="privacyCheckbox">
                    <Link to="/signup/privacy" target="_blank" rel="noopener noreferrer">
                      개인정보 수집·이용 동의
                    </Link>
                    에 동의합니다.
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="signup-error-message">{errorMessage}</div>
              )}
            </div>

            <div className="signup-right-bottom-section">
              {/* STEP 0 "다음" 버튼 */}
              <button 
                className="signup-button" 
                onClick={handleNext}
                disabled={!isStep0Valid}
                style={{
                  cursor: !isStep0Valid ? "not-allowed" : "pointer",
                  opacity: !isStep0Valid ? 0.5 : 1,
                }}
              >
                <div className={`signup-next-button ${isStep0Valid ? "active" : ""}`}>
                  다음
                </div>
              </button>
            </div>
          </>
        );
      }

      case 1: {
        // STEP 1 유효성 여부 계산
        const isStep1Valid =
          email.includes("@") &&
          isCodeValid &&
          password.length >= 8 &&
          password === confirmPassword;

        return (
          <>
            <div className="signup-right-top-section">
              {/* STEP 1: 이메일 입력 & 인증번호 발송 */}
              <div className="signup-input with-button">
                <CommunicationMail />
                <input
                  type="email"
                  className="signup-text-input"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  disabled={isCodeValid}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailMessage("");
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className={
                    email.trim() && !isCodeValid 
                      ? "signup-button-sm active" 
                      : "signup-button-sm"
                  }
                  disabled={isCodeValid}
                  style={{
                    cursor: isCodeValid ? "not-allowed" : "pointer",
                    opacity: isCodeValid ? 0.5 : 1,
                  }}
                >
                  발송
                </button>
              </div>
              {emailMessage && (
                <div className="signup-info-message">{emailMessage}</div>
              )}

              {/* STEP 1: 인증번호 입력 & 확인 */}
              <div className="signup-input with-button">
                <InterfaceCheck />
                <input
                  type="text"
                  className="signup-text-input"
                  placeholder="인증번호를 입력하세요"
                  value={verificationCode}
                  disabled={isCodeValid}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setErrorMessage("");
                    setCodeMessage("");
                  }}
                />
                <button
                  type="button"
                  onClick={handleConfirmCode}
                  className={
                    verificationCode.trim() && !isCodeValid
                      ? "signup-button-sm active"
                      : "signup-button-sm"
                  }
                  disabled={isCodeValid}
                  style={{
                    cursor: isCodeValid ? "not-allowed" : "pointer",
                    opacity: isCodeValid ? 0.5 : 1,
                  }}
                >
                  확인
                </button>
              </div>
              {codeMessage && (
                <div
                  className={
                    isCodeValid
                      ? "signup-success-message"
                      : "signup-error-message"
                  }
                >
                  {codeMessage}
                </div>
              )}

              {/* STEP 1: 비밀번호 입력 */}
              <div className="signup-password">
                <LockLight1 />
                <input
                  type="password"
                  className="signup-text-input"
                  placeholder="비밀번호 (최소 8자)"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {passwordMessage && (
                <div className="signup-error-message">{passwordMessage}</div>
              )}

              {/* STEP 1: 비밀번호 확인 입력 */}
              <div className="signup-password">
                <LockLight1 />
                <input
                  type="password"
                  className="signup-text-input"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              {confirmMessage && (
                <div className="signup-error-message">{confirmMessage}</div>
              )}

              {errorMessage && (
                <div className="signup-error-message">{errorMessage}</div>
              )}
            </div>

            <div className="signup-right-bottom-section">
              <div className="signup-step-group">
                <button className="signup-button" onClick={handleBack}>
                  <div className="signup-before-button">이전</div>
                </button>

                {/* STEP 1 "다음" 버튼 */}
                <button 
                  className="signup-button" 
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  style={{
                    cursor: !isStep1Valid ? "not-allowed" : "pointer",
                    opacity: !isStep1Valid ? 0.5 : 1,
                  }}
                >
                  <div className={`signup-next-button ${isStep1Valid ? "active" : ""}`}>
                    다음
                  </div>
                </button>
              </div>
            </div>
          </>
        );
      }

      case 2: {
        // STEP 2 유효성 여부 계산 (GitHub URL은 선택 사항)
        const isStep2Valid =
          !githubLink.trim() || githubLink.startsWith("https://github.com/");

        return (
          <>
            <div className="signup-right-top-section">
              {/* STEP 2: GitHub URL 입력 (선택) */}
              <div className="signup-input">
                <InterfaceLinkHorizontal />
                <input
                  type="url"
                  className="signup-text-input"
                  placeholder="GitHub URL (선택사항, 예: https://github.com/username)"
                  value={githubLink}
                  onChange={(e) => {
                    setGithubLink(e.target.value);
                    setErrorMessage("");
                  }}
                />
              </div>

              {errorMessage && (
                <div className="signup-error-message">{errorMessage}</div>
              )}
            </div>

            <div className="signup-right-bottom-section">
              <div className="signup-step-group">
                <button className="signup-button" onClick={handleBack}>
                  <div className="signup-before-button">이전</div>
                </button>

                {/* STEP 2 "회원가입 완료" 버튼 */}
                <button 
                  className="signup-button" 
                  onClick={handleSignUp}
                  disabled={!isStep2Valid}
                  style={{
                    cursor: !isStep2Valid ? "not-allowed" : "pointer",
                    opacity: !isStep2Valid ? 0.5 : 1,
                  }}
                >
                  <div className={`signup-next-button ${isStep2Valid ? "active" : ""}`}>
                    회원가입 완료
                  </div>
                </button>
              </div>
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <PageTransitionWrapper>
      <GoBackIcon
        className="signup-component-18"
        onClick={() => navigate(-1)}
      />
      <div className="signup">
        <div className="signup-div">
          {/* 왼쪽: 로고 영역 */}
          <div className="signup-left-section">
            <div className="signup-left-content">
              <div className="signup-logo-container">
                <img src="/img/AlOG-logo.png" alt="Alog Logo" />
              </div>
            </div>
          </div>

          {/* 오른쪽: 단계별 회원가입 폼 */}
          <div className="signup-right-section">{renderStepContent()}</div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default SignUp;