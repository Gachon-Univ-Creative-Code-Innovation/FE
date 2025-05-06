import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoGitHub from "../../components/GoGitHub/GoGitHub";
import GoPortfolio from "../../components/GoPortfolio/GoPortfolio";
import Navbar from "../../components/Navbar/Navbar";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import BlogEditIcon from "../../icons/BlogEditIcon/BlogEditIcon";
import SettingIcon from "../../icons/SettingIcon/SettingIcon";
import CommentIcon2 from "../../icons/CommentIcon2/CommentIcon2";
import "./MyBlog.css";

export const MyBlog = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(
    "23년째 다이어트 호소중인 여리여리한 소녀입니다"
  );

  return (
    <PageTransitionWrapper>
      <Navbar isLoggedIn={true} onShowPopup={() => {}} />
      <div className="myblog-wrapper">
        <div className="myblog-content-frame">
          <header className="myblog-header">
            <div className="myblog-profile-container">
              <img
                className="myblog-profile-image"
                alt="Chatgpt"
                src="/img/chatgpt-image-2025-4-20-06-18-49.png"
              />
              <div className="myblog-profile-details">
                <div className="myblog-username-box">
                  <div className="myblog-username-row">
                    <div className="myblog-username">Dietter</div>
                    <SettingIcon
                      className="myblog-icon-subtract"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/edituser")}
                    />
                  </div>
                </div>
                <div className="myblog-follow-info">
                  <div className="myblog-follow-box">
                    <div className="myblog-follow-label">Follower</div>
                    <div className="myblog-follow-count">400</div>
                  </div>
                  <div className="myblog-follow-box">
                    <div className="myblog-follow-label">Following</div>
                    <div className="myblog-follow-count">370</div>
                  </div>
                </div>
                <div className="myblog-description-box">
                  <div className="myblog-description-row">
                    {isEditing ? (
                      <input
                        className="myblog-description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setIsEditing(false);
                        }}
                        autoFocus
                      />
                    ) : (
                      <>
                        <p className="myblog-description">{description}</p>
                        <BlogEditIcon
                          className="myblog-icon-vector"
                          onClick={() => setIsEditing(true)}
                          style={{ cursor: "pointer" }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="myblog-side-buttons">
                <GoPortfolio
                  className="myblog-btn-default"
                  property1="default"
                />
                <GoGitHub className="myblog-btn-github" property1="default" />
              </div>
            </div>
          </header>

          <div className="myblog-post-section">
            <div className="myblog-post-header">
              <div className="myblog-tab-latest">
                <div className="myblog-post-title">최신글</div>
              </div>
            </div>

            <div className="myblog-post-list">
              <div className="myblog-post-grid">
                {[...Array(14)].map((_, i) => (
                  <div className="myblog-post-card" key={i}>
                    <div
                      className={
                        i < 4 ? "myblog-post-image" : "myblog-post-placeholder"
                      }
                    >
                      {i < 4 && (
                        <img
                          className="myblog-post-image"
                          alt="Thumbnail"
                          src={`/img/rectangle-31${i > 0 ? `-${i}` : ""}.png`}
                        />
                      )}
                    </div>
                    <div className="myblog-post-content">
                      <p className="myblog-post-snippet">
                        아 진짜 다이어트 해야하는데...
                      </p>
                      <div className="myblog-post-meta">
                        <div className="myblog-post-date">2025. 03. 23</div>
                        <div className="myblog-post-comment">
                          <CommentIcon2 className="myblog-comment-icon" />
                          <div className="myblog-comment-count">0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MyBlog;
