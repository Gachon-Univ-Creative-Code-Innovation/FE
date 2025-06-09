import React, { useEffect, useState } from "react";
import "./MatchingModal.css";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import api from "../../api/instance";

const MatchingModal = ({ isOpen, onClose, matchedIds = [] }) => {
  // 더미데이터 제거, 빈 배열로 초기화
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!matchedIds.length) {
      setUsers([]);
      return;
    }

    // 고정된 값 없이 matchedIds 전체 사용
    const fetchUsers = async () => {
      const initialUsers = matchedIds.map((id) => ({
        id,
        name: "",
        experience: "",
        skills: [],
        profileImage: null,
        portfolioUrl: "",
        githubUrl: null,
        blogUrl: null,
      }));
      setUsers(initialUsers);

      matchedIds.forEach((userId, idx) => {
        // 유저 기본 정보 fetch
        api.get(`/user-service/details/${userId}`)
          .then((res) => {
            const data = res.data;
            if (data.status === 200 && data.data) {
              setUsers((prev) => {
                const copy = [...prev];
                if (copy[idx]) {
                  copy[idx].name = data.data.nickname || `유저${userId}`;
                  copy[idx].profileImage = data.data.profileUrl ? data.data.profileUrl : "/img/basic_profile_photo.png";
                  copy[idx].githubUrl = data.data.githubUrl;
                  copy[idx].blogUrl = data.data.email ? `mailto:${data.data.email}` : null;
                  copy[idx].experience = data.data.email || "";
                }
                return copy;
              });
            } else {
              setUsers((prev) => {
                const copy = [...prev];
                if (copy[idx]) {
                  copy[idx].name = "unknown";
                  copy[idx].profileImage = "/img/basic_profile_photo.png";
                }
                return copy;
              });
            }
          })
          .catch(() => {
            setUsers((prev) => {
              const copy = [...prev];
              if (copy[idx]) {
                copy[idx].name = "unknown";
                copy[idx].profileImage = "/img/basic_profile_photo.png";
              }
              return copy;
            });
          });


        api.get(`/matching-service/represent-tags`, { params: { userID: userId, topK: 4 }, headers: { accept: "application/json" } })
          .then((res) => {
            const data = res.data;
            if (data.status === 200 && Array.isArray(data.data)) {
              setUsers((prev) => {
                const copy = [...prev];
                if (copy[idx]) copy[idx].skills = data.data.map((tag) => `#${tag}`);
                return copy;
              });
            }
          })
          .catch(() => {});


        api.get(`/portfolio-service/user`, { params: { userID: userId }, headers: { accept: "application/json" } })
          .then((res) => {
            const data = res.data;
            if (data.status === 200 && data.data) {
              setUsers((prev) => {
                const copy = [...prev];
                if (copy[idx]) copy[idx].portfolioUrl = `/portfolio/view/:${data.data}`;
                return copy;
              });
            }
          })
          .catch(() => {});
      });
    };

    fetchUsers();
    // eslint-disable-next-line
  }, [matchedIds]);

  const handlePortfolioClick = (e, url) => {
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  };

  const handleGithubClick = (e, url) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleProfileClick = (userId) => {
    if (userId) window.open(`/blog/${userId}`, "_blank");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
          {users.map((user, idx) => (
            <div
              key={user.id}
              className="matching-user-card"
              onClick={() => handleProfileClick(user.id)}
            >
              <div className="matching-user-profile">
                <div className="matching-user-avatar">
                  <img
                    className="matching-modal-profile-image"
                    alt="Profile"
                    src={user.profileImage ? user.profileImage : "/img/basic_profile_photo.png"}
                    onError={(e) => {
                      e.currentTarget.src = "/img/basic_profile_photo.png";
                    }}
                  />
                </div>
                <div className="matching-user-info">
                  <h3 className="matching-user-name">{user.name || `유저${user.id}`}</h3>
                  <p className="matching-user-experience">{user.experience}</p>
                  <div className="matching-user-skills">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="matching-user-actions">
                <button
                  className={`action-button portfolio-button ${!user.portfolioUrl ? "disabled" : ""}`}
                  onClick={(e) => handlePortfolioClick(e, user.portfolioUrl)}
                  disabled={!user.portfolioUrl}
                >
                  포트폴리오 →
                </button>
                <button
                  className={`action-button github-button ${!user.githubUrl ? "disabled" : ""}`}
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