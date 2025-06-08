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
import api from "../../api/local-instance";


const AnalysisResult = ({ userId, roadmapName, svgText }) => {
  return (
    <div className="roadmap-result-wrapper">
      <div className="roadmap-result-container">
        <p className="roadmap-result-text">
          <span>분석 결과, {userId}님은 </span>
          <span className="highlight">{roadmapName} 개발자</span>
          <span>
            의 역량과 성향을 지니고 있어요.
            <br/>
            지금부터 {userId}님만을 위한 맞춤 로드맵을 안내해드릴게요.
          </span>
        </p>

        <div
          className="roadmap-result-image"
          style={{
            width: '100%',
            minHeight: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            borderRadius: '12px',
            boxShadow: '0 2px 12px 0 rgba(60,60,60,0.07)',
            margin: '24px 0',
            overflow: 'visible',
            padding: 0,
          }}
        >
          {svgText ? (
            <div
              style={{
                width: '100%',
                maxWidth: '100vw',
                minHeight: '220px',
                display: 'block',
                overflow: 'visible',
              }}
              dangerouslySetInnerHTML={{ __html: svgText }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '40px 0', width: '100%' }}>
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" stroke="#b0b0b0" strokeWidth="3" fill="#f3f3f3"/><path d="M16 24h16M24 16v16" stroke="#b0b0b0" strokeWidth="3" strokeLinecap="round"/></svg>
              <div style={{ marginTop: 12 }}>로드맵 SVG를 불러올 수 없습니다.</div>
            </div>
          )}
        </div> 
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
  const [roadmaps, setRoadmaps] = useState([]);


  const handleCardClick = (svgText, title) => {
    setPopupImage(svgText);
    setPopupTitle(title);
    setShowPopup(true);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetcRecommended = async () => {
      try {
        const apiUrl = "http://localhost:8080/api/roadmap/ai-recommend";
        console.log("로드맵 API 호출 시작: ", apiUrl);
        const response = await api.post(
        apiUrl,
        {},
        { headers: { Accept: "application/json" } }
        );
        console.log("로드맵 API 응답: ", response);

        const data = response.data;
        setUserId(data.userId);
        setRoadmapName(data.recommendedRoadmap.roadmapName);
        setSvgUrl(data.recommendedRoadmap.svgUrl);


        if (data.recommendedRoadmap.svgUrl) {
          const svgRes = await api.get(data.recommendedRoadmap.svgUrl, { responseType: "text" });
          setSvgText(svgRes.data);
        }
      } catch (err) {
        console.error("추천 로드맵 API 호출 실패:", err);
      }
    };
    fetcRecommended();
  }, []);

  useEffect(() => {

    const fetchRoadmaps = async () => {
      try {
        const apiUrl = "http://localhost:8080/api/roadmap";
        console.log("로드맵 API 호출 시작: ", apiUrl);
        const response = await api.get(
          apiUrl, 
          {},
          {
            headers: { Accept: "application/json" }
          }
        );
        console.log("로드맵 API 응답: ", response);
        if (response.data.status === "200") {
          const data = response.data.data;

          const roadmapsWithSvg = await Promise.all(
            data.map(async (roadmap) => {
              if (roadmap.svgUrl) {
                try {
                  const svgTextRes = await api.get(roadmap.svgUrl, { responseType: "text" });
                  return { ...roadmap, svgText: svgTextRes.data };
                } catch (err) {
                  console.error(`SVG URL 다운로드 실패: ${roadmap.roadmapName}`, err);
                  return { ...roadmap, svgText: null };
                }
              }
              return { ...roadmap, svgText: null };
            })
          );
          setRoadmaps(roadmapsWithSvg);
        } else {
          console.error("로드맵 조회 실패:", response.data);
        }
      } catch (err) {
        console.error("로드맵 API 호출 실패: ", err);
      }
    };

    fetchRoadmaps();
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
              <RoadmapList onCardClick={handleCardClick} shouldFetch={selectedTab === "SeeRoadmap"} />
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
