import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NoticeBell from "../../icons/NoticeBell/NoticeBell";
import AlogLogo from "../../icons/AlogLogo/AlogLogo";
import PencilIcon from "../../icons/PencilIcon/PencilIcon";
import MailIcon from "../../icons/MailIcon/MailIcon";
import HamburgerIcon from "../../icons/HamburgerIcon/HamburgerIcon";
import { HamburgerScreen } from "../HamburgerScreen/HamburgerScreen";
import "./Navbar.css";

const Navbar = ({ onShowPopup, scrolled, isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  const handleLogoClick = () => {
    if (location.pathname.includes("After")) {
      navigate("/MainPageAfter");
    } else {
      navigate("/MainPagebefore");
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
              <img className="navbar-icon" alt="Icon" src="/img/icon.svg" />
              <NoticeBell
                className="navbar-bell"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  isLoggedIn ? navigate("/notice") : onShowPopup();
                }}
              />
              <MailIcon
                className="navbar-mail"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  isLoggedIn ? navigate("/message") : onShowPopup();
                }}
              />
              <div
                className="navbar-edit"
                style={{ cursor: "pointer" }}
                onClick={onShowPopup}
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
