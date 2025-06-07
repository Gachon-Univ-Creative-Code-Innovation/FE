// src/screens/MyBlog/MyBlog.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GoGitHub from "../../components/GoGitHub/GoGitHub";
import GoPortfolio from "../../components/GoPortfolio/GoPortfolio";
import Navbar from "../../components/Navbar/Navbar";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SettingIcon from "../../icons/SettingIcon/SettingIcon";
import CommentIcon2 from "../../icons/CommentIcon2/CommentIcon2";
import api from "../../api/instance";
import "./MyBlog.css";

// 텍스트에 물결 애니메이션 적용
const WaveText = ({ text, className }) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const loop = () => {
      setAnimating(true);
      const duration = (text.length * 0.15 + 0.6) * 1000;
      setTimeout(() => {
        setAnimating(false);
        setTimeout(loop, 3000);
      }, duration);
    };
    const timer = setTimeout(loop, 1000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className={`wave-letter ${animating ? "wave-animate" : ""}`}
          style={{ "--delay": `${i * 0.15}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
};

export const MyBlog = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken") || "";

  // 프로필 및 팔로우 정보
  const [nickname, setNickname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 게시글 로딩 상태
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 로그인 체크 및 사용자 정보 가져오기
  useEffect(() => {
    if (!token) return navigate("/login");

    api
      .get("/user-service/user/patch", { headers: { Authorization: token } })
      .then((res) => {
        const d = res.data.data || {};
        setNickname(d.nickname || "");
        setProfileUrl(d.profileUrl || "");
        setGithubUrl(d.githubUrl || "");
      })
      .catch((err) => console.error("내 정보 조회 실패:", err));

    api
      .get("/user-service/follow/followers", {
        headers: { Authorization: token },
      })
      .then((res) => setFollowerCount((res.data.data || []).length))
      .catch((err) => console.error("팔로워 조회 실패:", err));

    api
      .get("/user-service/follow/followees", {
        headers: { Authorization: token },
      })
      .then((res) => setFollowingCount((res.data.data || []).length))
      .catch((err) => console.error("팔로잉 조회 실패:", err));
  }, [token, navigate]);

  // 게시글 불러오기
  useEffect(() => {
    if (!token || !hasMore) return;
    setLoading(true);

    api
      .get(`/blog-service/posts?page=${page}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        const data = res.data.data || [];
        setPosts((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      })
      .catch((err) => console.error("게시글 조회 실패:", err))
      .finally(() => setLoading(false));
  }, [page, hasMore, token]);

  // 무한 스크롤 관찰 설정
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <PageTransitionWrapper>
      <Navbar isLoggedIn={true} onShowPopup={() => {}} />

      <div className="myblog-wrapper">
        <div className="myblog-content-frame">
          {/* 프로필 헤더 */}
          <header className="myblog-header">
            <div className="myblog-profile-container">
              <div
                className="myblog-profile-image"
                style={{
                  backgroundColor: "#d9d9d9",
                  backgroundImage: profileUrl ? `url(${profileUrl})` : "none",
                }}
              />
              <div className="myblog-profile-details">
                <div className="myblog-username-row">
                  <div className="myblog-username">{nickname || "사용자"}</div>
                  <SettingIcon
                    className="myblog-icon-subtract"
                    onClick={() => navigate("/mypage")}
                  />
                </div>
                <div className="myblog-follow-info">
                  <div
                    className="myblog-follow-box"
                    onClick={() => navigate("/follow")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="myblog-follow-label">팔로워</div>
                    <div className="myblog-follow-count">{followerCount}</div>
                  </div>
                  <div
                    className="myblog-follow-box"
                    onClick={() => navigate("/follow")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="myblog-follow-label">팔로잉</div>
                    <div className="myblog-follow-count">{followingCount}</div>
                  </div>
                </div>
              </div>

              <div className="myblog-side-buttons">
                <div onClick={() => navigate("/portfolio")}>
                  <GoPortfolio property1="default" />
                </div>
                <div
                  onClick={() => githubUrl && window.open(githubUrl, "_blank")}
                  style={{ marginLeft: 8 }}
                >
                  <GoGitHub property1="default" />
                </div>
              </div>
            </div>
          </header>

          {/* 게시글 목록 */}
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
                      key={post.postId}
                      ref={isLast ? lastPostRef : null}
                      className="myblog-post-card"
                      onClick={() => navigate(`/viewpost/${post.postId}`)}
                    >
                      <div
                        className="myblog-post-image"
                        style={{
                          backgroundColor: "#d9d9d9",
                          backgroundImage: post.thumbnail
                            ? `url(${post.thumbnail})`
                            : "none",
                        }}
                      />
                      <div className="myblog-post-content">
                        <p className="myblog-post-snippet">{post.summary}</p>
                        <div className="myblog-post-meta">
                          <div className="myblog-post-date">
                            {post.createdAt}
                          </div>
                          <div className="myblog-post-comment">
                            <CommentIcon2 />
                            <div className="myblog-comment-count">
                              {post.commentCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 게시글 없을 때 */}
              {!loading && posts.length === 0 && (
                <WaveText
                  text="당신의 이야기를 기다리고 있습니다 ✍️"
                  className="myblog-empty-message"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MyBlog;
