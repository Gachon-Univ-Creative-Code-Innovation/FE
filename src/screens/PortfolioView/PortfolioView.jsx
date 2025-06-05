import React, { useState, useRef, useEffect } from "react";
import "./PortfolioView.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../../api/local-instance";

const PortfolioView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // URL의 :id 값 사용 가능
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const myName = localStorage.getItem("userId") || "";

  // 포트폴리오 데이터를 상태로 관리 (초기값 최소화)
  const [portfolio, setPortfolio] = useState({
    id: '',
    title: '',
    author: '',
    date: '',
    content: ''
  });
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [authorNickname, setAuthorNickname] = useState('');

  // 포트폴리오 상세 데이터 가져오기
  useEffect(() => {
    if (!id) return;
    // id가 ":1"처럼 들어오면 앞의 콜론(:)을 제거
    const cleanId = id.startsWith(":") ? id.slice(1) : id;
    const fetchPortfolioDetail = async () => {
      try {
        const url = `http://localhost:8080/api/portfolio-service/detail`;
        // const url = `http://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8080/api/portfolio-service/detail`;
        const res = await api.get(url, { params: { portfolioID: cleanId }, headers: { Accept: "application/json" } });
        const data = res.data;
        if (data && data.status === 200 && data.data) {
          setPortfolio({
            id: cleanId,
            title: data.data.title || '',
            author: data.data.author || '',
            date: data.data.date || '',
            content: data.data.content || ''
          });
          setLikeCount(data.data.like_count ?? 0);
          // 닉네임 가져오기
          if (data.data.author) {
            fetch(`http://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8000/api/user-service/profile-nickname/${data.data.author}`)
              .then(r => r.json())
              .then(profileData => {
                if (profileData && profileData.status === 200 && profileData.data && profileData.data.nickname) {
                  setAuthorNickname(profileData.data.nickname);
                } else {
                  setAuthorNickname(data.data.author);
                }
              })
              .catch(() => setAuthorNickname(data.data.author));
          } else {
            setAuthorNickname('');
          }
        }
      } catch (err) {
        // 에러 처리 (필요시)
      }
    };
    fetchPortfolioDetail();
  }, [id]);

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
          id: portfolio.id,
          title: portfolio.title,
          content: portfolio.content,
          tags: portfolio.tags || '',
          // 필요시 author, date 등 추가 가능
        }
      }
    });
    setOpenMenuId(null);
  };

  // 포트폴리오 삭제 버튼 클릭
  const handleDeletePortfolio = async () => {
    if (window.confirm("정말로 이 포트폴리오를 삭제하시겠습니까?")) {
      try {
        // id가 ":1"처럼 들어오면 앞의 콜론(:)을 제거
        const cleanId = id && id.startsWith(":") ? id.slice(1) : id;
        const url = `http://localhost:8080/api/portfolio-service/delete`;
        // const url = `http://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8080/api/portfolio-service/delete`;  
        const res = await api.delete(url, { params: { portfolioID: cleanId }, headers: { 'Accept': 'application/json' } });
        if (res.status === 200 || res.data?.status === 200) {
          alert("포트폴리오가 삭제되었습니다.");
          navigate('/portfolio');
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (err) {
        alert("삭제 중 오류가 발생했습니다.");
      }
      setOpenMenuId(null);
    }
  };

  const isMyPortfolio = String(portfolio.author) === String(myName);

  const handleLike = async () => {
    // id가 ":1"처럼 들어오면 앞의 콜론(:)을 제거
    const cleanId = id && id.startsWith(":") ? id.slice(1) : id;
    try {
      const url = `http://localhost:8080/api/portfolio-service/like`;
      // const url = `http://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8080/api/portfolio-service/like`;
      const res = await api.post(url, '', { params: { portfolioID: cleanId }, headers: { 'Accept': 'application/json' } });
      // 서버 응답에 따라 likeCount, liked 상태 변경
      if (res.status === 200 || res.data?.status === 200) {
        if (liked) {
          setLikeCount(likeCount - 1);
        } else {
          setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
      }
    } catch (err) {
      // 에러 처리 (필요시)
    }
  };

  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="view-post-container" style={{ marginTop: "100px" }}>
        {/* 내용 외 정보 */}
        <div className="view-post-header">
          <div className="view-post-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="view-post-title">{portfolio.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isMyPortfolio && (
                <div className="comment-menu-wrapper" style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
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
              <button
                className={`like-btn${liked ? ' liked' : ''}`}
                onClick={handleLike}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: liked ? '#e74c3c' : '#888',
                  marginLeft: isMyPortfolio ? '0' : '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="좋아요"
              >
                <span style={{marginRight: '6px'}}>{liked ? '❤️' : '🤍'}</span>
                <span>{likeCount}</span>
              </button>
            </div>
          </div>
          <div className="view-post-meta-line">
            <div className="view-post-meta">
              <span>{authorNickname || portfolio.author}</span>
              <span>{portfolio.date}</span>
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