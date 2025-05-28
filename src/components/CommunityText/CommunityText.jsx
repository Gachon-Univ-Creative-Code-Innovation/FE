import React, { useEffect, useState } from "react";
import Cone from "../Cone/Cone";
import Cube from "../Cube/Cube";
import Donut from "../Donut/Donut";
import "./CommunityText.css";

export const CommunityText = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleLines(1), 0),
      setTimeout(() => setVisibleLines(2), 1000),
      setTimeout(() => setVisibleLines(3), 2000),
      setTimeout(() => {
        setShowFinalMessage(true); //앞선 문장 삭제
      }, 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="communitytext-frame">
      <div className="communitytext-text-group">
        {!showFinalMessage && (
          <>
            {visibleLines >= 1 && (
              <div className="communitytext-line fade-in">
                <p className="communitytext-text">
                  <span className="communitytext-bold">스터디</span>
                  <span className="communitytext-regular">부터</span>
                </p>
              </div>
            )}
            {visibleLines >= 2 && (
              <div className="communitytext-line fade-in">
                <p className="communitytext-text">
                  <span className="communitytext-bold">공모전</span>
                  <span className="communitytext-regular">까지</span>
                </p>
              </div>
            )}
            {visibleLines >= 3 && (
              <div className="communitytext-line fade-in">
                <p className="communitytext-text">
                  <span className="communitytext-bold">함께할 팀원</span>
                  <span className="communitytext-regular">을 찾고 있나요?</span>
                </p>
              </div>
            )}
          </>
        )}

        {showFinalMessage && (
          <div className="communitytext-line fade-in">
            <p className="communitytext-text highlight">
              지금 여기서 시작해보세요!
            </p>
          </div>
        )}
      </div>

      <div className="communitytext-shape-group">
        <Cone className="communitytext-cone" color="white-glossy" />
        <Cube className="communitytext-cube" color="iridescent" />
        <Donut className="communitytext-donut" color="purple-glossy" />
      </div>
    </div>
  );
};

export default CommunityText;
