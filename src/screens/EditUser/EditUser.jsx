import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import Navbar2 from "../../components/Navbar2/Navbar2";
import UserEditIcon from "../../icons/UserEditIcon/UserEditIcon";
import { NicknameScreen } from "../NicknameScreen/NicknameScreen";
import { EmailScreen } from "../EmailScreen/EmailScreen";
import { PasswordScreen } from "../PasswordScreen/PasswordScreen";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import api from "../../api/instance";
import "./EditUser.css";

export const EditUser = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [savedPassword, setSavedPassword] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGithubLink, setIsEditingGithubLink] = useState(false);
  const [githubLinkError, setGithubLinkError] = useState("");

  const [isNicknamePopupOpen, setIsNicknamePopupOpen] = useState(false);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/user/patch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setNickname(data.nickname);
        setEmail(data.email);
        setName(data.name);
        setGithubLink(data.githubUrl || "");
        setProfileUrl(data.profileUrl || "");
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

  const openEmailPopup = () => {
    setIsEmailPopupOpen(true);
    setIsFadingOut(false);
  };
  const closeEmailPopup = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsEmailPopupOpen(false);
      setIsFadingOut(false);
    }, 250);
  };
  const handleEmailSave = (newEmail) => {
    setEmail(newEmail);
    closeEmailPopup();
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
      setGithubLinkError("유효한 GitHub 링크를 입력해주세요.");
    }
  };

  const handleFinalSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (savedPassword) formData.append("password", savedPassword);
      if (nickname) formData.append("nickname", nickname);
      if (githubLink) formData.append("githubUrl", githubLink);
      if (profileFile) formData.append("profileImage", profileFile);

      await api.patch("/user-service/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/mypage");
    } catch (err) {
      console.error("회원 정보 수정 실패:", err);
      // 필요한 경우 에러 메시지 UI로 보여주기
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
                      >
                        <UserEditIcon />
                      </div>
                    </>
                  )}
                </div>
              </div>

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

              <div className="edituser-password">
                <CommunicationMail className="edituser-communication-mail" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-3">{email}</div>
                  <div onClick={openEmailPopup} style={{ cursor: "pointer" }}>
                    <UserEditIcon />
                  </div>
                </div>
              </div>

              <div className="edituser-password">
                <LockLight1 className="edituser-lock-light" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-2">
                    {savedPassword ? "********" : "비밀번호 미설정"}
                  </div>
                </div>
                <div onClick={openPasswordPopup} style={{ cursor: "pointer" }}>
                  <UserEditIcon />
                </div>
              </div>

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

            <div className="edituser-foot" onClick={handleFinalSave}>
              <div className="edituser-login-button">
                <div className="edituser-LOGIN">Save</div>
              </div>
            </div>
          </div>
        </div>

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

        {isEmailPopupOpen && (
          <div
            className={`nickname-popup-overlay ${
              isFadingOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="nickname-popup-content animated-popup">
              <EmailScreen onClose={closeEmailPopup} onSave={handleEmailSave} />
            </div>
          </div>
        )}

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
