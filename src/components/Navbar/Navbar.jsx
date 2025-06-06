import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NoticeBell from "../../icons/NoticeBell/NoticeBell";
import AlogLogo from "../../icons/AlogLogo/AlogLogo";
import PencilIcon from "../../icons/PencilIcon/PencilIcon";
import MailIcon from "../../icons/MailIcon/MailIcon";
import HamburgerIcon from "../../icons/HamburgerIcon/HamburgerIcon";
import { HamburgerScreen } from "../HamburgerScreen/HamburgerScreen";
import { useAlarmStore } from "../../store/useAlarmStore";
import { useWebSocket } from "../../contexts/WebSocketContext";
import "./Navbar.css";

const Navbar = ({ onShowPopup, scrolled, isLoggedIn, onSearch }) => { // onSearch prop 추가함
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const hasUnread = useAlarmStore((state) => state.hasUnread);
  const { unreadTotalCount } = useWebSocket();

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  // 로고 클릭 시: JWT 토큰이 있으면 MainPageAfter, 없으면 MainPageBefore
  const handleLogoClick = () => {
    const jwt = localStorage.getItem("jwtToken");
    if (jwt) {
      navigate("/MainPageAfter");
    } else {
      navigate("/MainPageBefore");
    }
  };

  return (
    <>
      <div className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar-frame">
          <div
            className="navbar-left"
            onClick={toggleSidebar}
            style={{ cursor: "pointer" }}
          >
            <HamburgerIcon />
          </div>

          <div
            className="navbar-center"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            <AlogLogo className="navbar-logo" width={200} height={80} />
          </div>

          <div className="navbar-right">
            <div className="navbar-icons">
              <img
                  className="navbar-icon"
                  alt="Icon"
                  src="/img/icon.svg"
                  onClick={onSearch}    // 추가
                  style={{ cursor: "pointer" }}
                />
              <div style={{ position: "relative", display: "inline-block" }}>
                <NoticeBell
                  className="navbar-bell"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    isLoggedIn ? navigate("/notice") : onShowPopup();
                  }}
                />
                {hasUnread && <span className="alarm-badge"></span>}
              </div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <MailIcon
                  className="navbar-mail"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    isLoggedIn ? navigate("/message") : onShowPopup();
                  }}
                />
                {unreadTotalCount > 0 && (
                  <span className="unread-msg-badge">{unreadTotalCount}</span>
                )}
              </div>
              <div
                className="navbar-edit"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  isLoggedIn ? navigate("/write") : onShowPopup();
                }}
              >
                <PencilIcon width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`hamburger-sidebar ${showSidebar ? "open" : ""}`}>
        <HamburgerScreen
          isLoggedIn={isLoggedIn}
          onClose={closeSidebar}
          onShowPopup={onShowPopup}
        />
      </div>

      {showSidebar && (
        <div className="hamburger-overlay" onClick={closeSidebar} />
      )}
    </>
  );
};

export default Navbar;
