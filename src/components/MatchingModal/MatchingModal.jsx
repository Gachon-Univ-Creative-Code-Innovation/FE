import React, {useEffect} from "react";
import "./MatchingModal.css";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";

const MatchingModal = ({ isOpen, onClose }) => {
  // 매칭된 사용자 데이터 
  const matchedUsers = [
    {
      id: 1,
      name: "경주니",
      experience: "3년차 FE 개발자",
      skills: ["#React", "#JavaScript", "#Flutter", "#Dart"],
      profileImage: "/img/rectangle-31-1.png",
      portfolioUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg",
      githubUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg",
      blogUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg"
    },
    {
      id: 2,
      name: "준바이",
      experience: "1년차 BE 개발자",
      skills: ["#SpringBoot", "#Java"],
      profileImage: "/img/rectangle-31.png",
      portfolioUrl: null,
      githubUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg",
      blogUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg"
    },
    {
      id: 3,
      name: "쪼꼬",
      experience: "2년차 디자이너",
      skills: ["#UI/UX", "#Figma", "#Sketch"],
      profileImage: null, // 프로필 이미지가 없는 경우
      portfolioUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg",
      githubUrl: null, // 깃허브가 없는 경우
      blogUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg"
    },
    {
      id: 4,
      name: "승듀",
      experience: "5년차 풀스택 개발자",
      skills: ["#Node.js", "#React", "#GraphQL"],
      profileImage: null, // 프로필 이미지가 없는 경우
      portfolioUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg",
      githubUrl: null, // 깃허브가 없는 경우
      blogUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg"
    },
    {
      id: 5,
      name: "쏭이",
      experience: "4년차 모바일 개발자",
      skills: ["#ReactNative", "#Swift", "#Kotlin"],
      profileImage: "/img/basic_profile_photo2.jpeg",
      portfolioUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg",
      githubUrl: null, // 깃허브가 없는 경우
      blogUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg"
    },
    {
      id: 6,
      name: "잼오",
      experience: "3년차 데이터 엔지니어",
      skills: ["#Python", "#SQL", "#BigData"],
      profileImage: null, // 프로필 이미지가 없는 경우
      portfolioUrl: null,
      githubUrl: null, // 깃허브가 없는 경우
      blogUrl: "https://i.pinimg.com/736x/f9/39/f9/f939f97b5c5f1488e09a441c1fa52d3d.jpg"
    }
  ];

  const handlePortfolioClick = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleGithubClick = (e, url) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleProfileClick = (blogUrl) => {
    window.open(blogUrl, '_blank');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // cleanup: 모달 unmount 시 원복
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="matching-modal-overlay" onClick={onClose}>
      <div className="matching-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="matching-modal-header">
          <h2 className="matching-modal-title">AIOG가 적합한 유저를 찾아봤어요!</h2>
          <p className="matching-modal-subtitle">클릭하면 해당 유저의 프로필을 볼 수 있어요 🔍</p>
          <button className="matching-modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* 사용자 목록 */}
        <div className="matching-users-list">
          {matchedUsers.map((user) => (
            <div 
              key={user.id} 
              className="matching-user-card"
              onClick={() => handleProfileClick(user.blogUrl)}
            >
              <div className="matching-user-profile">
                <div className="matching-user-avatar">
                  <img 
                    src={user.profileImage ? user.profileImage : "/img/basic_profile_photo.png"}
                    alt="profile"
                    onError={e => { e.target.src = "/img/basic_profile_photo.png"; }}
                  />
                </div>
                <div className="matching-user-info">
                  <h3 className="matching-user-name">{user.name}</h3>
                  <p className="matching-user-experience">{user.experience}</p>
                  <div className="matching-user-skills">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="matching-user-actions">
                <button 
                  className={`action-button portfolio-button ${!user.portfolioUrl ? 'disabled' : ''}`}
                  onClick={(e) => handlePortfolioClick(e, user.portfolioUrl)}
                >
                  포트폴리오 →
                </button>
                <button 
                  className={`action-button github-button ${!user.githubUrl ? 'disabled' : ''}`}
                  onClick={(e) => handleGithubClick(e, user.githubUrl)}
                  disabled={!user.githubUrl}
                >
                  GitHub →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingModal;