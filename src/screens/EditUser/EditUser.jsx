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

  // ─── ① 편집용 상태 ─────────────────────────────────────
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [savedPassword, setSavedPassword] = useState("");

  // ─── ② 원본 상태(서버에서 받아온 값) ──────────────────────
  const [originalName, setOriginalName] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalGithubLink, setOriginalGithubLink] = useState("");
  const [originalProfileUrl, setOriginalProfileUrl] = useState("");

  // 편집 모드, 팝업 제어, 에러 메시지 등 기존 상태들...
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGithubLink, setIsEditingGithubLink] = useState(false);
  const [githubLinkError, setGithubLinkError] = useState("");
  const [isNicknamePopupOpen, setIsNicknamePopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const fileInputRef = useRef(null);

  // ─── ② useEffect: 사용자 정보 가져와서 편집 상태 + 원본 상태 모두 설정 ───
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/user/patch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;

        // [편집 상태]
        setNickname(data.nickname);
        setEmail(data.email);
        setName(data.name);
        setGithubLink(data.githubUrl || "");
        setProfileUrl(data.profileUrl || "");

        // [원본 상태]
        setOriginalNickname(data.nickname);
        setOriginalName(data.name);
        setOriginalGithubLink(data.githubUrl || "");
        setOriginalProfileUrl(data.profileUrl || "");
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
      }
    };
    fetchUserInfo();
  }, []);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileUrl(reader.result);
    reader.readAsDataURL(file);
  };

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

  // ─── ③ 수정된 필드만 골라서 PATCH 요청 보내기 ─────────────────────────
  const handleFinalSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const formData = new FormData();

      // 1) 이름(name)이 원본(originalName)과 다를 때만 추가
      if (name && name !== originalName) {
        formData.append("name", name);
      }

      // 2) 비밀번호(password)는 원본에 저장되어 있지 않으므로, 새로운 값이 있을 때만 추가
      if (savedPassword) {
        formData.append("password", savedPassword);
      }

      // 3) 닉네임(nickname)이 원본(originalNickname)과 다를 때만 추가
      if (nickname && nickname !== originalNickname) {
        formData.append("nickname", nickname);
      }

      // 4) GitHub 링크(githubLink)가 원본(originalGithubLink)과 다를 때만 추가
      if (githubLink && githubLink !== originalGithubLink) {
        formData.append("githubUrl", githubLink);
      }

      // 5) 프로필 이미지(profileFile)가 존재할 때만 추가
      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      // 변경된 필드가 하나도 없다면, 굳이 API 호출을 하지 않아도 됩니다.
      // 아래 주석을 해제하면 “변경된 항목 없을 때” API 요청을 생략할 수 있습니다.
      // -------------------------------
      // if (formData.keys().next().done) {
      //   return;
      // }
      // -------------------------------

      await api.patch("/user-service/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // multipart/form-data의 Content-Type은 브라우저가 자동으로 설정합니다.
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

            <div className="edituser-view-2">
              {/*  이름 편집 파트  */}
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

              {/* 닉네임 편집 파트 */}
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

              {/* 이메일 표시 (편집 불필요) */}
              <div className="edituser-password">
                <CommunicationMail className="edituser-communication-mail" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-3">{email}</div>
                </div>
              </div>

              {/* 비밀번호 수정 팝업 */}
              <div className="edituser-password">
                <LockLight1 className="edituser-lock-light" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-2">*************</div>
                </div>
                <div onClick={openPasswordPopup} style={{ cursor: "pointer" }}>
                  <UserEditIcon />
                </div>
              </div>

              {/* GitHub 링크 편집 파트 */}
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

        {/* 닉네임 팝업 */}
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

        {/* 비밀번호 팝업 */}
        {isPasswordPopupOpen && (
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
