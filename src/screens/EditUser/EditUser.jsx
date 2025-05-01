import React, { useState } from "react";
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
import "./EditUser.css";

export const EditUser = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("저장된 닉네임 불러옴");
  const [name, setName] = useState("저장된 이름 불러옴");
  const [email, setEmail] = useState("저장된 이메일 불러옴");
  const [githubLink, setGithubLink] = useState("https://github.com/yoururl");
  const [savedPassword, setSavedPassword] = useState(""); // 비밀번호 저장 상태

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGithubLink, setIsEditingGithubLink] = useState(false);
  const [githubLinkError, setGithubLinkError] = useState("");

  const [isNicknamePopupOpen, setIsNicknamePopupOpen] = useState(false);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // 닉네임
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

  // 이메일
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

  // 비밀번호
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

  // 깃허브 링크 유효성
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
        "유효한 GitHub 링크를 입력해주세요. (예: https://github.com/username)"
      );
    }
  };

  const handleFinalSave = () => {
    // 저장된 데이터 확인 (필요시 서버 전송)
    console.log("닉네임:", nickname);
    console.log("이름:", name);
    console.log("이메일:", email);
    console.log("깃허브 링크:", githubLink);
    console.log("비밀번호:", savedPassword ? "●●●●●●" : "미설정");

    navigate("/mypage");
  };

  return (
    <PageTransitionWrapper>
      <div className="edituser-screen">
        <Navbar2 />
        <div className="edituser-div" style={{ marginTop: "100px" }}>
          <div className="edituser-frame">
            <div className="edituser-view-wrapper">
              <div className="edituser-view">
                <div className="edituser-div-wrapper">
                  <div className="edituser-text-wrapper">
                    저장된 이미지 불러옴
                  </div>
                </div>
                <div className="edituser-edit-ic-wrapper">
                  <UserEditIcon />
                </div>
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
