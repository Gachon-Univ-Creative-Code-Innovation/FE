import React, { useState, useRef, useEffect } from "react";
import "./PortfolioView.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import { useNavigate, useLocation } from "react-router-dom";

const PortfolioView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const myName = "김송희";

  // 포트폴리오 데이터를 상태로 관리
  const [portfolio, setPortfolio] = useState({
    id: 1,
    title: "모바일 앱 UX/UI 디자인 프로젝트",
    author: "김송희",
    date: "2025.03.26",
    tag: "#UX/UI #모바일앱 #프로토타입",
    content: `<p>이 프로젝트는 모바일 앱의 UX/UI 디자인을 개선하기 위한 것입니다. 사용자 경험을 최적화하고, 직관적인 인터페이스를 제공하기 위해 다양한 프로토타입을 제작했습니다.</p>
    <p>프로젝트의 주요 목표는 사용자 피드백을 반영하여 앱의 사용성을 향상시키는 것이었습니다. 이를 위해 사용자 테스트를 진행하고, 그 결과를 바탕으로 디자인을 반복적으로 개선했습니다.</p>
    <p>프로젝트 결과물은 다음과 같습니다:</p>
    <ul>
      <li>사용자 인터뷰 및 설문조사 결과 분석</li>
      <li>프로토타입 디자인 및 사용자 테스트</li>
      <li>최종 디자인 시안 및 개발팀과의 협업</li>
    </ul>
    <p>이 프로젝트를 통해 사용자 중심의 디자인 프로세스를 경험하고, 실제 앱 개발에 기여할 수 있었습니다. 앞으로도 이러한 경험을 바탕으로 더 나은 UX/UI 디자인을 위해 노력할 것입니다.</p>
    <img src="https://i.pinimg.com/736x/c7/74/09/c77409011332c7359ec194cb21ea57ea.jpg" alt="프로젝트 이미지" style="max-width: 100%; height: auto; margin-top: 20px;" />`  
  });   

  // HTML 컨텐츠를 안전하게 렌더링하는 함수 (이미지 포함)
  const renderContent = (content) => {
    if (!content) return null;
    
    // ReactQuill의 HTML 컨텐츠를 그대로 렌더링
    // 보안을 위해 dangerouslySetInnerHTML 사용 시 주의필요
    return (
      <div 
        className="post-content-html"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ 
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}
      />
    );
  };

  // 수정된 데이터를 받아와서 포트폴리오 정보 업데이트
  useEffect(() => {
    if (location.state?.updatedPortfolio) {
      const updatedPortfolio = location.state.updatedPortfolio;
      setPortfolio(prevPortfolio => ({
        ...prevPortfolio,
        title: updatedPortfolio.title || prevPortfolio.title,
        content: updatedPortfolio.content || prevPortfolio.content,
        tag: updatedPortfolio.tags || prevPortfolio.tag,
        id: updatedPortfolio.id || prevPortfolio.id
      }));
      // state 정리
      window.history.replaceState({}, document.title);
    } else if (location.state?.newPortfolio) {
      // 새 포트폴리오인 경우
      const newPortfolio = location.state.newPortfolio;
      setPortfolio({
        id: newPortfolio.id,
        title: newPortfolio.title,
        author: newPortfolio.author,
        date: new Date(newPortfolio.createdAt).toISOString().slice(0, 10).replace(/-/g, '.'),
        tag: newPortfolio.tags,
        content: newPortfolio.content
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  // 포트폴리오 수정 버튼 클릭 - Write 페이지로 이동
  const handleEditPortfolio = () => {
    navigate('/portfolio/write', { 
      state: { 
        editMode: true,
        portfolioData: {
          title: portfolio.title,
          content: portfolio.content,
          tags: portfolio.tag,
          id: portfolio.id
        }
      }
    });
    setOpenMenuId(null);
  };

  // 포트폴리오 삭제 버튼 클릭
  const handleDeletePortfolio = () => {
    if (window.confirm("정말로 이 포트폴리오를 삭제하시겠습니까?")) {
      console.log("포트폴리오 삭제하기");
      setOpenMenuId(null);
      // navigate('/portfolio');
    }
  };

  const isMyPortfolio = portfolio.author === myName;

  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="view-post-container" style={{ marginTop: "100px" }}>
        {/* 내용 외 정보 */}
        <div className="view-post-header">
          <div className="view-post-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="view-post-title">{portfolio.title}</h1>
            {isMyPortfolio && (
              <div className="comment-menu-wrapper">
                <div
                  className="comment-menu"
                  onClick={() => setOpenMenuId(openMenuId === 'portfolio' ? null : 'portfolio')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="13" cy="8" r="1.5"/>
                  </svg>
                </div>
                {openMenuId === 'portfolio' && (
                  <div className="comment-menu-popup" ref={menuRef}>
                    <button 
                      className="comment-menu-item"
                      onClick={handleEditPortfolio}
                    >
                      수정하기
                    </button>
                    <button 
                      className="comment-menu-item"
                      onClick={handleDeletePortfolio}
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="view-post-meta-line">
            <div className="view-post-meta">
              <span>{portfolio.author}</span>
              <span>{portfolio.date}</span>
            </div>
          </div>
          <div className="view-post-tags-line">
          <div className="view-post-tags">
            {portfolio.tag
              .split("#")
              .map(tag => tag.trim())
              .filter(tag => tag.length > 0)
              .map((tag, index) => (
                <span key={index}>{tag}</span>
            ))}
          </div>
          </div>
        </div>

        {/* 본문 카드 */}
        <div className="view-post-card">
          <div className="view-post-content">
            <div className="view-post-body">
              {renderContent(portfolio.content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;