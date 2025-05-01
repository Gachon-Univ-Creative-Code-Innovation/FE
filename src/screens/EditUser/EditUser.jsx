import React, { useState } from "react";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import Navbar2 from "../../components/Navbar2/Navbar2";
import UserEditIcon from "../../icons/UserEditIcon/UserEditIcon";
import { NicknameScreen } from "../NicknameScreen/NicknameScreen";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./EditUser.css";

export const EditUser = () => {
  const [isNicknamePopupOpen, setIsNicknamePopupOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [nickname, setNickname] = useState("저장된 닉네임 불러옴");
  const [name, setName] = useState("저장된 이름 불러옴");
  const [isEditingName, setIsEditingName] = useState(false);

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
              {/* 이름 수정 영역 */}
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

              {/* 닉네임 수정 */}
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

              {/* 이메일 */}
              <div className="edituser-password">
                <CommunicationMail className="edituser-communication-mail" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-3">
                    저장된 이메일 불러옴
                  </div>
                  <UserEditIcon />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="edituser-password">
                <LockLight1 className="edituser-lock-light" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-2">비밀번호 변경</div>
                </div>
                <UserEditIcon />
              </div>

              {/* 깃허브 */}
              <div className="edituser-password">
                <InterfaceLinkHorizontal className="edituser-interface-link" />
                <div className="edituser-frame-2">
                  <div className="edituser-text-wrapper-2">
                    저장된 깃허브 링크 불러옴
                  </div>
                  <UserEditIcon />
                </div>
              </div>
            </div>

            <button className="edituser-foot">
              <button className="edituser-login-button">
                <div className="edituser-LOGIN">Save</div>
              </button>
            </button>
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
      </div>
    </PageTransitionWrapper>
  );
};

export default EditUser;
