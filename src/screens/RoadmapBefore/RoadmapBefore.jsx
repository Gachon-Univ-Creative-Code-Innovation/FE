import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyzeResult from "../../components/AnalyzeResult/AnalyzeResult";
import SeeRoadMap from "../../components/SeeRoadmap/SeeRoadmap";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import Navbar2 from "../../components/Navbar2/Navbar2";
import GoLogin from "../../components/GoLogin/GoLogin";
import "./RoadMapBefore.css";

export const RoadMapBefore = () => {
  const [selectedTab, setSelectedTab] = useState("AnalyzeResult");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />
      <div className="roadmapbefore-screen">
        <div className="roadmapbefore-container">
          <div className="roadmapbefore-category">
            <div onClick={() => setSelectedTab("AnalyzeResult")}>
              <AnalyzeResult
                className="roadmap-generate-instance"
                property1={
                  selectedTab === "AnalyzeResult" ? "selected" : "default"
                }
              />
            </div>
            <div onClick={() => setSelectedTab("SeeRoadmap")}>
              <SeeRoadMap
                className="roadmap-history-instance"
                property1={
                  selectedTab === "SeeRoadmap" ? "selected" : "default"
                }
              />
            </div>
          </div>

          <div className="roadmapbefore-overlap">
            <div className="roadmapbefore-ellipse" />
            <div className="roadmapbefore-overlap-group">
              <div className="roadmapbefore-ellipse-2" />
              <div className="roadmapbefore-ellipse-3" />

              <p className="roadmapbefore-login-text">
                개인 맞춤 로드맵을 확인하려면 로그인이 필요해요.
                <br />
                지금 로그인하고 당신만의 로드맵을 만나보세요!
              </p>

              <GoLogin
                className="roadmapbefore-login-button"
                property1="default"
                onClick={handleLoginClick}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default RoadMapBefore;
