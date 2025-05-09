import React, { useState, useEffect, useRef, useCallback } from "react";
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

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    const newPosts = Array.from({ length: 10 }).map((_, i) => ({
      id: (page - 1) * 10 + i + 1,
      date: "2025. 03. 23",
      snippet: "아 진짜 다이어트 해야하는데...",
      image: `/img/rectangle-31${i % 4 === 0 ? "" : `-${i % 4}`}.png`,
      showImage: i % 4 < 4,
    }));
    setPosts((prev) => [...prev, ...newPosts]);
  }, [page]);

  const lastPostRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

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
                      onClick={() => navigate("/mypage")}
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
                {posts.map((post, i) => {
                  const isLast = i === posts.length - 1;
                  return (
                    <div
                      className="myblog-post-card"
                      key={post.id}
                      ref={isLast ? lastPostRef : null}
                    >
                      <div
                        className={
                          post.showImage
                            ? "myblog-post-image"
                            : "myblog-post-placeholder"
                        }
                      >
                        {post.showImage && (
                          <img
                            className="myblog-post-image"
                            alt="Thumbnail"
                            src={post.image}
                          />
                        )}
                      </div>
                      <div className="myblog-post-content">
                        <p className="myblog-post-snippet">{post.snippet}</p>
                        <div className="myblog-post-meta">
                          <div className="myblog-post-date">{post.date}</div>
                          <div className="myblog-post-comment">
                            <CommentIcon2 className="myblog-comment-icon" />
                            <div className="myblog-comment-count">0</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MyBlog;
