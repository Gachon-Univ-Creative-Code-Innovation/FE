import React, { useState, useEffect } from "react";
import AnalyzeResult from "../../components/AnalyzeResult/AnalyzeResult";
import SeeRoadMap from "../../components/SeeRoadmap/SeeRoadmap";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import RoundedCube from "../../components/RoundedCube/RoundedCube";
import RoadmapList from "../../components/RoadmapList/RoadmapList";
import RoadmapPopup from "../ShowRoadMap/ShowRoadMap";
import { Canvas } from "@react-three/fiber";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./RoadMap.css";

const AnalysisResult = () => {
  return (
    <div className="roadmap-result-wrapper">
      <div className="roadmap-result-container">
        <p className="roadmap-result-text">
          <span>분석 결과, 송히님은 </span>
          <span className="highlight">Frontend 개발자</span>
          <span>
            의 역량과 성향을 지니고 있어요.
            <br />
            지금부터 송히님만을 위한 맞춤 로드맵을 안내해드릴게요.
          </span>
        </p>

        <img
          className="roadmap-result-image"
          alt="Frontend Roadmap"
          src="/img/frontend-1.png"
        />
      </div>
    </div>
  );
};

export const RoadMap = () => {
  const [selectedTab, setSelectedTab] = useState("AnalyzeResult");
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showCube, setShowCube] = useState(false);
  const [showText, setShowText] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const handleCardClick = (image, title) => {
    setPopupImage(image);
    setPopupTitle(title);
    setShowPopup(true);
  };

  useEffect(() => {
    const timerText = setTimeout(() => setShowText(true), 500);
    const timerCube = setTimeout(() => setShowCube(true), 1000);
    const timerDone = setTimeout(() => setIsAnalyzing(false), 5000);
    return () => {
      clearTimeout(timerText);
      clearTimeout(timerCube);
      clearTimeout(timerDone);
    };
  }, []);

  return (
    <PageTransitionWrapper>
      <Navbar2 />
      <div className="roadmap-screen">
        <div className="roadmap-container">
          <div className="roadmap-category">
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

          <div className="roadmap-content">
            {isAnalyzing ? (
              <div className="roadmap-cube-wrapper">
                {showCube && (
                  <Canvas
                    style={{ width: 300, height: 300 }}
                    camera={{ position: [0, 0, 7], fov: 50 }}
                  >
                    <RoundedCube />
                  </Canvas>
                )}
                {showText && (
                  <div className="roadmap-loading-text">분석 중입니다</div>
                )}
              </div>
            ) : selectedTab === "AnalyzeResult" ? (
              <AnalysisResult />
            ) : (
              <RoadmapList onCardClick={handleCardClick} />
            )}
          </div>

          {showPopup && (
            <div className="readme-popup-overlay">
              <RoadmapPopup
                image={popupImage}
                title={popupTitle}
                onClose={() => setShowPopup(false)}
              />
            </div>
          )}
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default RoadMap;
