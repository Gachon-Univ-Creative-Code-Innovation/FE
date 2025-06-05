// src/screens/Blog/Blog.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GoGitHub from "../../components/GoGitHub/GoGitHub";
import GoPortfolio from "../../components/GoPortfolio/GoPortfolio";
import Navbar2 from "../../components/Navbar2/Navbar2";
import FollowButton from "../../components/FollowButton/FollowButton";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import CommentIcon2 from "../../icons/CommentIcon2/CommentIcon2";
import api from "../../api/instance";
import "./Blog.css";

export const Blog = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const viewedUserId = Number(userId);

  const [nickname, setNickname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  useEffect(() => {
    api
      .get(`/user-service/details/${viewedUserId}`)
      .then((res) => {
        const data = res.data.data;
        setNickname(data.nickname || "");
        setProfileUrl(data.profileUrl || "");
        setGithubUrl(data.githubUrl || "");
      })
      .catch((err) => {
        console.error("타인 사용자 조회 에러:", err);
      });
  }, [viewedUserId]);

  useEffect(() => {
    if (!hasMore) return;

    setLoading(true);

    api
      .get(`/blog-service/posts/user/${viewedUserId}?page=${page}`)
      .then((res) => {
        const data = res.data.data || [];
        setPosts((prev) => [...prev, ...data]);
        if (data.length === 0) {
          setHasMore(false);
        }
      })
      .catch((err) => console.error("게시글 조회 에러:", err))
      .finally(() => setLoading(false));
  }, [page, viewedUserId, hasMore]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handlePortfolioClick = () => {
    api
      .get("/portfolio-service/user", {
        params: { userID: viewedUserId },
        headers: { accept: "application/json" },
      })
      .then((res) => {
        const data = res.data;
        if (data.status === 200 && data.data) {
          navigate(`/portfolio/view/${data.data}`);
        }
      })
      .catch(() => {
        // 실패 시 그냥 /portfolio 로 이동하거나 에러 처리
        console.error("포트폴리오 조회 실패");
        navigate("/portfolio");
      });
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="blog-wrapper">
        <div className="blog-content-frame">
          <header className="blog-header">
            <div className="blog-profile-container">
              <img
                className="blog-profile-image"
                alt="Profile"
                src={profileUrl || "/img/default-profile.png"}
                onError={(e) =>
                  (e.currentTarget.src = "/img/default-profile.png")
                }
              />
              <div className="blog-profile-details">
                <div className="blog-username-row">
                  <div className="blog-username">{nickname || "사용자"}</div>
                  <FollowButton onClick={() => {}} />
                </div>
              </div>

              <div className="blog-side-buttons">
                <div
                  onClick={handlePortfolioClick}
                  style={{ cursor: "pointer" }}
                >
                  <GoPortfolio
                    className="blog-btn-default"
                    property1="default"
                  />
                </div>

                <div
                  onClick={() =>
                    githubUrl ? window.open(githubUrl, "_blank") : null
                  }
                  style={{
                    cursor: githubUrl ? "pointer" : "default",
                    marginLeft: "8px",
                  }}
                >
                  <GoGitHub className="blog-btn-github" property1="default" />
                </div>
              </div>
            </div>
          </header>

          <div className="blog-post-section">
            <div className="blog-post-header">
              <div className="blog-tab-latest">
                <div className="blog-post-title">작성글</div>
              </div>
            </div>
            <div className="blog-post-list">
              <div className="blog-post-grid">
                {posts.map((post, i) => {
                  const isLast = i === posts.length - 1;
                  return (
                    <div
                      className="blog-post-card"
                      key={post.postId}
                      ref={isLast ? lastPostRef : null}
                    >
                      <div className="blog-post-image">
                        <img
                          className="blog-post-image"
                          alt="Thumbnail"
                          src={post.thumbnail}
                        />
                      </div>
                      <div className="blog-post-content">
                        <p className="blog-post-snippet">{post.summary}</p>
                        <div className="blog-post-meta">
                          <div className="blog-post-date">{post.createdAt}</div>
                          <div className="blog-post-comment">
                            <CommentIcon2 className="blog-comment-icon" />
                            <div className="blog-comment-count">
                              {post.commentCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!loading && posts.length === 0 && (
                <div className="blog-empty-message">
                  아직 작성된 글이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Blog;
