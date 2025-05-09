import React, { useState, useEffect } from "react";
import DownloadIcon from "../../icons/DownloadIcon/DownloadIcon";
import AnalyzeResult from "../../components/AnalyzeResult/AnalyzeResult";
import SeeRoadMap from "../../components/SeeRoadmap/SeeRoadmap";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import RoundedCube from "../../components/RoundedCube/RoundedCube";
import { Canvas } from "@react-three/fiber";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./RoadMap.css";

const AnalysisResult = () => {
  return (
    <div className="roadmap-result-wrapper">
      <div className="roadmap-result-container">
        <div className="roadmap-result-topbar">
          <div className="roadmap-result-flex-fill" />
          <div className="roadmap-result-flex-fill" />
        </div>

        <p className="roadmap-result-text">
          <span>분석 결과, 송짱님은 </span>
          <span className="highlight">Frontend 개발자</span>
          <span>
            로서의 역량과 성향을 지니고 있어요.
            <br />
            지금부터 송짱님만을 위한 맞춤 로드맵을 안내해드릴게요.
          </span>
        </p>

        <div className="roadmap-result-download">
          <DownloadIcon className="roadmap-result-icon" color="black" />
          <div className="roadmap-result-download-text">Download</div>
        </div>

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransitionWrapper>
      <Navbar2 />
      <div className="roadmap-screen">
        <div className="roadmap-container">
          {/* 탭 메뉴 */}
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

          {/* 콘텐츠 영역 */}
          <div className="roadmap-content">
            {isAnalyzing ? (
              <div
                className="roadmap-cube-wrapper"
                style={{ flexDirection: "column", alignItems: "center" }}
              >
                <Canvas
                  style={{ width: 300, height: 300 }}
                  camera={{ position: [0, 0, 7], fov: 50 }}
                >
                  <RoundedCube />
                </Canvas>
                <div className="roadmap-loading-text">분석 중입니다</div>
              </div>
            ) : (
              <AnalysisResult />
            )}
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default RoadMap;
