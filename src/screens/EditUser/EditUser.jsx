import React from "react";
import CommunicationMail from "../../icons/CommunicationMail/CommunicationMail";
import InterfaceLinkHorizontal from "../../icons/InterfaceLinkHorizontal/InterfaceLinkHorizontal";
import LockLight1 from "../../icons/LockLight1/LockLight1";
import UserIcon from "../../icons/UserIcon/UserIcon";
import UserUserCardId from "../../icons/UserUserCardId/UserUserCardId";
import Navbar2 from "../../components/Navbar2/Navbar2";
import UserEditIcon from "../../icons/UserEditIcon/UserEditIcon";
import "./EditUser.css";

export const EditUser = () => {
  return (
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
                <div className="edituser-text-wrapper-2">
                  저장된 이름 불러옴
                </div>
                <UserEditIcon />
              </div>
            </div>

            <div className="edituser-password">
              <UserUserCardId className="edituser-user-user-card-ID" />
              <div className="edituser-frame-2">
                <div className="edituser-text-wrapper-3">
                  저장된 닉네임 불러옴
                </div>
                <UserEditIcon />
              </div>
            </div>

            <div className="edituser-password">
              <CommunicationMail className="edituser-communication-mail" />
              <div className="edituser-frame-2">
                <div className="edituser-text-wrapper-3">
                  저장된 이메일 불러옴
                </div>
                <UserEditIcon />
              </div>
            </div>

            <div className="edituser-password">
              <LockLight1 className="edituser-lock-light" />
              <div className="edituser-frame-2">
                <div className="edituser-text-wrapper-2">비밀번호 변경</div>
              </div>
            </div>

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
    </div>
  );
};

export default EditUser;
