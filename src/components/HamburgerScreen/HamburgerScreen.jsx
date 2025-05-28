import React from "react";
import { useNavigate } from "react-router-dom";
import Community from "../CommunityComponent/CommunityComponent";
import LogoutComponent from "../LogoutComponent/LogoutComponent";
import Myblog from "../MyBlogComponent/MyBlogComponent";
import Mypage from "../MypageComponent/MypageComponent";
import Portfolio from "../PortfolioComponent/PortfolioComponent";
import Roadmap from "../RoadmapComponent/RoadmapComponent";
import Readme from "../ReadmeComponent/ReadmeComponent";
import "./HamburgerScreen.css";

export const HamburgerScreen = ({ isLoggedIn, onClose, onShowPopup }) => {
  const navigate = useNavigate();

  const handleProtectedRoute = (path) => {
    onClose();
    if (isLoggedIn) {
      navigate(path);
    } else {
      onShowPopup(); // 로그인 안 되어 있으면 팝업
    }
  };

  return (
    <div className="hamburger-screen">
      <Mypage
        className="hamburger-component-instance"
        property1="default"
        onClick={() => handleProtectedRoute("/mypage")}
      />
      <Myblog
        className="hamburger-component-instance"
        property1="default"
        onClick={() => handleProtectedRoute("/myblog")}
      />
      <Community
        className="hamburger-component-instance"
        property1="default"
        onClick={() => {
          onClose(); // 닫기 동작은 유지
          navigate("/community"); // 로그인 관계없이 이동
        }}
      />
      <Portfolio
        className="hamburger-component-instance"
        property1="default"
        onClick={() => handleProtectedRoute("/portfolio")}
      />
      <Roadmap
        className="hamburger-component-instance"
        property1="default"
        onClick={() => {
          onClose();
          if (isLoggedIn) {
            navigate("/roadmap");
          } else {
            navigate("/roadmapbefore");
          }
        }}
      />

      <Readme
        property1="default"
        className="hamburger-component-instance"
        onClick={() => handleProtectedRoute("/generatereadme")}
      />

      <div onClick={onClose}>
        <LogoutComponent text={isLoggedIn ? "LOGOUT" : "LOGIN"} />
      </div>
    </div>
  );
};

export default HamburgerScreen;
