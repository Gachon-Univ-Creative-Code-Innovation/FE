import React, { useEffect, useState } from "react";
import Cone from "../Cone/Cone";
import Cube from "../Cube/Cube";
import Donut from "../Donut/Donut";
import "./CommunityText.css";

export const CommunityText = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [showBlur, setShowBlur] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [startWaveAnimation, setStartWaveAnimation] = useState(false);

  const fullText = "스터디부터 공모전까지\n함께할 팀원을 찾고 있나요?";
  const finalMessage = "지금 여기서 시작해보세요!";

  useEffect(() => {
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // 타이핑 완료 후 잠시 대기
        setTimeout(() => {
          setShowBlur(true);
        }, 1500);
        
        // 블러 효과 후 사라지고 새 메시지 표시
        setTimeout(() => {
          setShowFinalMessage(true);
          // 메시지가 나타난 후 파도 애니메이션 시작
          setTimeout(() => {
            startWaveLoop();
          }, 1200);
        }, 4500);
      }
    }, 80); // 80ms마다 한 글자씩

    return () => clearInterval(typingInterval);
  }, []);

  const startWaveLoop = () => {
    setStartWaveAnimation(true);
    
    // 파도 애니메이션 완료 후 (글자 수 * 0.15초 + 애니메이션 시간 0.6초 + 여유시간)
    const totalAnimationTime = (finalMessage.length * 0.15 + 0.6) * 1000;
    
    setTimeout(() => {
      setStartWaveAnimation(false);
      // 잠시 쉬었다가 다시 시작
      setTimeout(() => {
        startWaveLoop();
      }, 2000); // 2초 휴식 후 다시 시작
    }, totalAnimationTime);
  };

  const renderWaveText = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className={`wave-letter ${startWaveAnimation ? 'wave-animate' : ''}`}
        style={{ 
          '--delay': `${index * 0.15}s`,
          display: char === ' ' ? 'inline' : 'inline-block'
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const renderTypingText = (text) => {
    const boldWords = ['스터디', '공모전', '함께할 팀원'];
    let result = text;
    
    boldWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'g');
      result = result.replace(regex, `<bold>$1</bold>`);
    });
    
    return result.split(/(<bold>.*?<\/bold>)/).map((part, index) => {
      if (part.startsWith('<bold>') && part.endsWith('</bold>')) {
        const content = part.replace(/<\/?bold>/g, '');
        return <span key={index} className="communitytext-bold">{content}</span>;
      }
      return <span key={index} className="communitytext-regular">{part}</span>;
    });
  };

  return (
    <div className="communitytext-frame">
      <div className="communitytext-text-group">
        {!showFinalMessage && (
          <div className={`communitytext-typing-container ${showBlur ? 'blur-out' : ''}`}>
            <p className="communitytext-text" style={{ whiteSpace: 'pre-line' }}>
              {renderTypingText(displayedText)}
            </p>
          </div>
        )}

        {showFinalMessage && (
          <div className="communitytext-line fade-in">
            <p className="communitytext-text highlight">
              {renderWaveText(finalMessage)}
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
