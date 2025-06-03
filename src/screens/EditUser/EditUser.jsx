import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import Navbar2 from "../../components/Navbar2/Navbar2";
import UserEditIcon from "../../icons/UserEditIcon/UserEditIcon";
import NicknameScreen from "../NicknameScreen/NicknameScreen";
import PasswordScreen from "../PasswordScreen/PasswordScreen";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./EditUser.css";

export const EditUser = () => {
  const navigate = useNavigate();

  // 1. 편집용 상태: 사용자가 수정할 값들을 저장
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [savedPassword, setSavedPassword] = useState("");

  // 2. 원본 상태: 서버에서 받아온 초기 값들 (비교용)
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalGithubLink, setOriginalGithubLink] = useState("");
  const [originalProfileUrl, setOriginalProfileUrl] = useState("");

  // 3. 소셜 로그인 여부(state 추가)
  const [isSocialLogin, setIsSocialLogin] = useState(false);

  // 4. 팝업 및 편집 모드 관련 상태
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGithubLink, setIsEditingGithubLink] = useState(false);
  const [githubLinkError, setGithubLinkError] = useState("");
  const [isNicknamePopupOpen, setIsNicknamePopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // 파일 선택을 위한 ref
  const fileInputRef = useRef(null);

  // 5. useEffect: 사용자 정보 조회 및 초기 값 설정
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/user/patch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;

        // 편집용 상태에 초기 데이터 세팅
        setNickname(data.nickname);
        setEmail(data.email);
        setName(data.name);
        setGithubLink(data.githubUrl || "");
        setProfileUrl(data.profileUrl || "");

        // 원본 상태에 초기 데이터 세팅
        setOriginalNickname(data.nickname);
        setOriginalName(data.name);
        setOriginalGithubLink(data.githubUrl || "");
        setOriginalProfileUrl(data.profileUrl || "");

        // ➊ 소셜 로그인 여부도 상태로 저장
        setIsSocialLogin(data.socialLogin);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
      }
    };
    fetchUserInfo();
  }, []);

  // 6. 프로필 이미지 선택창 열기
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // 7. 프로필 이미지 변경 핸들러
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // 8. 닉네임 팝업 관련 함수
  const openNicknamePopup = () => {
    setIsNicknamePopupOpen(true);
    setIsFadingOut(false);
  };
  const closeNicknamePopup = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsNicknamePopupOpen(false);
      setIsFadingOut(false);
    }, 250);
  };
  const handleNicknameSave = (newNickname) => {
    setNickname(newNickname);
    closeNicknamePopup();
  };

  // 9. 비밀번호 팝업 관련 함수
  const openPasswordPopup = () => {
    setIsPasswordPopupOpen(true);
    setIsFadingOut(false);
  };
  const closePasswordPopup = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsPasswordPopupOpen(false);
      setIsFadingOut(false);
    }, 250);
  };
  const handlePasswordSave = (newPassword) => {
    setSavedPassword(newPassword);
    closePasswordPopup();
  };

  // 10. GitHub 링크 검증 및 블러 이벤트 핸들러
  const validateGithubLink = (link) => {
    const regex = /^https:\/\/github\.com\/[A-Za-z0-9_-]+$/;
    return regex.test(link);
  };
  const handleGithubLinkBlur = () => {
    if (validateGithubLink(githubLink)) {
      setGithubLinkError("");
      setIsEditingGithubLink(false);
    } else {
      setGithubLinkError(
        "유효한 GitHub 링크를 입력해주세요. ex) https://github.com/username"
      );
    }
  };

  // 11. 최종 저장: 수정된 필드만 서버에 PATCH 요청
  const handleFinalSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const formData = new FormData();

      // 이름이 변경되었을 때만 추가
      if (name && name !== originalName) {
        formData.append("name", name);
      }

      // 비밀번호는 소셜 로그인 사용자는 건너뜀
      if (!isSocialLogin && savedPassword) {
        formData.append("password", savedPassword);
      }

      // 닉네임이 변경되었을 때만 추가
      if (nickname && nickname !== originalNickname) {
        formData.append("nickname", nickname);
      }

      // GitHub 링크가 변경되었을 때만 추가
      if (githubLink && githubLink !== originalGithubLink) {
        formData.append("githubUrl", githubLink);
      }

      // 프로필 이미지 파일이 존재할 때만 추가
      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      // 변경된 항목이 없으면 API 호출 생략(선택사항)
      // if (formData.keys().next().done) {
      //   return;
      // }

      await api.patch("/user-service/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type은 브라우저가 자동으로 설정
        },
      });

      navigate("/mypage");
    } catch (err) {
      console.error("회원 정보 수정 실패:", err);
    }
  };

  return (
    <PageTransitionWrapper>
      <div className="edituser-screen">
        <Navbar2 />

        <div className="edituser-div" style={{ marginTop: 100 }}>
          <div className="edituser-frame">
            {/* 프로필 이미지 영역 */}
            <div className="edituser-view-wrapper">
              <div className="edituser-view">
                <div className="edituser-div-wrapper">
                  <img
                    src={profileUrl || "/img/profile-img.png"}
                    alt="프로필"
                    className="edituser-profile-img"
                  />
                </div>
                <div
                  className="edituser-edit-ic-wrapper"
                  onClick={openFilePicker}
                >
                  <UserEditIcon />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            {/* 사용자 정보 편집 영역 */}
            <div className="edituser-view-2">
              {/* 11-1. 이름 수정 파트 */}
              <div className="edituser-password">
                <UserIcon className="edituser-user-user" />
                <div className="edituser-frame-2">
                  {isEditingName ? (
                    <input
                      className="edituser-input"
                      value={name}
                      autoFocus
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setIsEditingName(false);
                      }}
                    />
                  ) : (
                    <>
                      <div className="edituser-text-wrapper-2">{name}</div>
                      <div
                        onClick={() => setIsEditingName(true)}
                        style={{ cursor: "pointer" }}
                      ></div>
                    </>
                  )}
                </div>
              </div>

              {/* 11-2. 닉네임 수정 파트 */}
              <div className="edituser-password">
                <UserUserCardId className="edituser-user-user-card-ID" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-3">{nickname}</div>
                  <div
                    onClick={openNicknamePopup}
                    style={{ cursor: "pointer" }}
                  >
                    <UserEditIcon />
                  </div>
                </div>
              </div>

              {/* 11-3. 이메일 표시 (편집 불필요) */}
              <div className="edituser-password">
                <CommunicationMail className="edituser-communication-mail" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-3">{email}</div>
                </div>
              </div>

              {/* 11-4. 비밀번호 수정 팝업 (소셜 로그인 시 숨김) */}
              {!isSocialLogin && (
                <div className="edituser-password">
                  <LockLight1 className="edituser-lock-light" />
                  <div className="edituser-frame-2">
                    <div className="edituser-text-wrapper-2">*************</div>
                  </div>
                  <div
                    onClick={openPasswordPopup}
                    style={{ cursor: "pointer" }}
                  >
                    <UserEditIcon />
                  </div>
                </div>
              )}

              {/* 11-5. GitHub 링크 수정 파트 */}
              <div className="edituser-password">
                <InterfaceLinkHorizontal className="edituser-interface-link" />
                <div className="edituser-frame-2">
                  {isEditingGithubLink ? (
                    <input
                      className="edituser-input"
                      value={githubLink}
                      autoFocus
                      onChange={(e) => {
                        setGithubLink(e.target.value);
                        setGithubLinkError("");
                      }}
                      onBlur={handleGithubLinkBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleGithubLinkBlur();
                      }}
                    />
                  ) : (
                    <>
                      <div className="edituser-text-wrapper-2">
                        {githubLink}
                      </div>
                      <div
                        onClick={() => setIsEditingGithubLink(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <UserEditIcon />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {githubLinkError && (
                <div className="edituser-error-message">{githubLinkError}</div>
              )}
            </div>

            {/* 저장 버튼 */}
            <div className="edituser-foot" onClick={handleFinalSave}>
              <div className="edituser-login-button">
                <div className="edituser-LOGIN">Save</div>
              </div>
            </div>
          </div>
        </div>

        {/* 닉네임 팝업 모달 */}
        {isNicknamePopupOpen && (
          <div
            className={`nickname-popup-overlay ${
              isFadingOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="nickname-popup-content animated-popup">
              <NicknameScreen
                onClose={closeNicknamePopup}
                onSave={handleNicknameSave}
              />
            </div>
          </div>
        )}

        {/* 비밀번호 팝업 모달 (소셜 로그인 시 렌더링되지 않음) */}
        {isPasswordPopupOpen && !isSocialLogin && (
          <div
            className={`nickname-popup-overlay ${
              isFadingOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="nickname-popup-content animated-popup">
              <PasswordScreen
                onClose={closePasswordPopup}
                onSave={handlePasswordSave}
              />
            </div>
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  );
};

export default EditUser;
