import React, { useEffect, useState } from "react";
import "./RoadmapList.css";
import axios from "axios";

const RoadmapList = ({ onCardClick }) => {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try{
        const res = await axios.get("/api/roadmap");
        if (res.data.status === "200") {
          const data = res.data.data;

          const roadmapsWithSvg = await Promise.all(
            data.map(async (roadmap) => {
              if (roadmap.svgUrl) {
                try{
                  const svgTextRes = await axios.get(roadmap.svgUrl, { responseType: "text" });
                  return { ...roadmap, svgText: svgTextRes.data };
                }catch (err) {
                  console.error("SVG URL 다운로드 실패: ${roadmap.roadmapName}", err);
                  return { ...roadmap, svgText: null };
              }
            }
              return { ...roadmap, svgText: null };
            })
          );
          setRoadmaps(roadmapsWithSvg);
      }else {
          console.error("로드맵 조회 실패:", res.data);
      }
    } catch (err) {
      console.error("로드맵 API 호출 실패: ", err);
    }
  };

  fetchRoadmaps();
  }, []);

  return (
    <div className="roadmaplist-wrapper">
      <div className="roadmaplist-container">
        {roadmaps.length === 0 ? (
          <div className="roadmaplist-empty">로드맵이 없습니다.</div>
        ) : (
          roadmaps.map((roadmap) => (
            <div
              key={roadmap.roadmapName + roadmap.roadmapId} 
              className="roadmaplist-card"
              onClick={() =>
                roadmap.svgText && onCardClick(roadmap.svgText, roadmap.roadmapName)
              }
              style={{ cursor: roadmap.svgText ? "pointer" : "not-allowed" }}
            >
              <div className="roadmap-card-inner">
                {roadmap.svgText ? (
                  <div
                    className="roadmaplist-image"
                    dangerouslySetInnerHTML={{ __html: roadmap.svgText }}
                  />
                ) : (
                  <div className="roadmaplist-image-placeholder">
                    이미지 없음
                  </div>
                )}
                <div className="roadmaplist-label">
                  {roadmap.roadmapName}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoadmapList;