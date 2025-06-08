import React, { useState, useEffect, useRef } from "react"; // useRef 추가
import AnalyzeResult from "../../components/AnalyzeResult/AnalyzeResult";
import SeeRoadMap from "../../components/SeeRoadmap/SeeRoadmap";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import RoundedCube from "../../components/RoundedCube/RoundedCube";
import RoadmapList from "../../components/RoadmapList/RoadmapList";
import RoadmapPopup from "../ShowRoadMap/ShowRoadMap";
import { Canvas } from "@react-three/fiber";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./RoadMap.css";
import axios from "axios";

const AnalysisResult = ({ userId, roadmapName, svgText }) => {
  return (
    <div className="roadmap-result-wrapper">
      <div className="roadmap-result-container">
        <p className="roadmap-result-text">
          <span>분석 결과, {userId}님은 </span>
          <span className="highlight">{roadmapName} 개발자</span>
          <span>
            의 역량과 성향을 지니고 있어요.
            <br />
            지금부터 {userId}님만을 위한 맞춤 로드맵을 안내해드릴게요.
          </span>
        </p>

        {svgText && (
          <div
            className="roadmap-result-image"
            dangerouslySetInnerHTML={{ __html: svgText }}
          />
        )}
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

  const [userId, setUserId] = useState("");
  const [roadmapName, setRoadmapName] = useState("");
  const [svgUrl, setSvgUrl] = useState("");
  const [svgText, setSvgText] = useState("");

  const handleCardClick = (svgText, title) => {
    setPopupImage(svgText);
    setPopupTitle(title);
    setShowPopup(true);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    console.log("useEffect 실행됨");
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.log("토큰이 없습니다.");
      return;
    }
    console.log("사용 중인 토큰:", token);

    let isMounted = true; // 컴포넌트가 마운트된 상태인지 확인

    const fetchData = async () => {
      try {
        // 추천 로드맵 API 호출
        const res = await axios.post("/api/roadmap/recommended-roadmap", {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted && res.data.status === "200" && res.data.data.length > 0) {
          const first = res.data.data[0];
          setUserId(first.userId);
          setRoadmapName(first.roadmapName);
          setSvgUrl(first.svgUrl);

          const svgResponse = await axios.get(first.svgUrl, {responseType: "text"});
          setSvgText(svgResponse.data);
        }
      } catch (err) {
        console.error("API 호출 실패:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // 컴포넌트가 언마운트되면 상태 업데이트 방지
    };
  }, []);

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
              <AnalysisResult
                userId={userId}
                roadmapName={roadmapName}
                svgText = {svgText}
              />
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
