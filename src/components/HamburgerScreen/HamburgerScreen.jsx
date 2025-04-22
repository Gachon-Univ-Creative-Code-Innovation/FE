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

export const HamburgerScreen = ({ isLoggedIn, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="hamburger-screen">
      <Mypage property1="default" />
      <Myblog className="hamburger-component-instance" property1="default" />
      <Community className="hamburger-component-instance" property1="default" />
      <Portfolio className="hamburger-component-instance" property1="default" />
      <Roadmap className="hamburger-component-instance" property1="default" />

      <Readme
        property1="default"
        className="hamburger-component-instance"
        onClick={() => {
          onClose();
          navigate("/generatereadme");
        }}
      />

      <div onClick={onClose}>
        <LogoutComponent text={isLoggedIn ? "LOGOUT" : "LOGIN"} />
      </div>
    </div>
  );
};
