// src/screens/MyBlog/MyBlog.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoGitHub from "../../components/GoGitHub/GoGitHub";
import GoPortfolio from "../../components/GoPortfolio/GoPortfolio";
import Navbar from "../../components/Navbar/Navbar";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SettingIcon from "../../icons/SettingIcon/SettingIcon";
import CommentIcon2 from "../../icons/CommentIcon2/CommentIcon2";
import api from "../../api/instance";
import "./MyBlog.css";

// 파도타기 효과 컴포넌트
const WaveText = ({ text, className }) => {
  const [startWaveAnimation, setStartWaveAnimation] = useState(false);

  useEffect(() => {
    const startWaveLoop = () => {
      setStartWaveAnimation(true);
      const totalTime = (text.length * 0.15 + 0.6) * 1000;
      setTimeout(() => {
        setStartWaveAnimation(false);
        setTimeout(startWaveLoop, 3000);
      }, totalTime);
    };
    const timer = setTimeout(startWaveLoop, 1000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className={`wave-letter ${startWaveAnimation ? "wave-animate" : ""}`}
          style={{ "--delay": `${i * 0.15}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
};

export const MyBlog = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("jwtToken") || "";

  // 프로필 정보
  const [nickname, setNickname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 게시글 상태
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 1) 내 정보 & 팔로워/팔로잉 조회 or 다른 사용자 정보 조회
  useEffect(() => {
    if (!jwtToken) return navigate("/login");

    const headers = { Authorization: jwtToken };

    if (authorId == null) {
      // 내 프로필 조회
      api
        .get("/user-service/user/patch", { headers })
        .then((res) => {
          const d = res.data.data || {};
          setNickname(d.nickname || "");
          setProfileUrl(d.profileUrl || "");
          setGithubUrl(d.githubUrl || "");
        })
        .catch((err) => console.error("내 정보 조회 에러:", err));

      api
        .get("/user-service/follow/followers", { headers })
        .then((res) => setFollowerCount((res.data.data || []).length))
        .catch((err) => console.error("팔로워 조회 에러:", err));

      api
        .get("/user-service/follow/followees", { headers })
        .then((res) => setFollowingCount((res.data.data || []).length))
        .catch((err) => console.error("팔로잉 조회 에러:", err));
    } else {
      // 다른 사용자 프로필 조회
      api
        .get(`/user-service/details/${authorId}`, { headers })
        .then((res) => {
          const d = res.data.data || {};
          setNickname(d.nickname || "");
          setProfileUrl(d.profileUrl || "");
          setGithubUrl(d.githubUrl || "");
        })
        .catch((err) => console.error("사용자 정보 조회 에러:", err));

      api
        .get(`/user-service/follow/followers/${authorId}`, { headers })
        .then((res) => setFollowerCount((res.data.data || []).length))
        .catch((err) => console.error("팔로워 조회 에러:", err));

      api
        .get(`/user-service/follow/followees/${authorId}`, { headers })
        .then((res) => setFollowingCount((res.data.data || []).length))
        .catch((err) => console.error("팔로잉 조회 에러:", err));
    }
  }, [jwtToken, navigate, authorId]);

  // 2) 게시글 불러오기 (내/다른 사용자)
  useEffect(() => {
    if (!jwtToken || !hasMore) return;
    setLoading(true);

    const url =
      authorId == null
        ? `/blog-service/posts?page=${page}`
        : `/blog-service/posts/user/${authorId}?page=${page}`;

    api
      .get(url, { headers: { Authorization: jwtToken } })
      .then((res) => {
        const data = res.data.data.postList || [];
        setPosts((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      })
      .catch((err) => console.error("게시글 조회 에러:", err))
      .finally(() => setLoading(false));
  }, [page, hasMore, jwtToken, authorId]);

  // 3) 무한 스크롤 옵저버
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 날짜 포맷 헬퍼
  const formatDate = (iso) =>
    iso ? iso.split("T")[0].replace(/-/g, ".") : "날짜 없음";

  return (
    <PageTransitionWrapper>
      <Navbar isLoggedIn onShowPopup={() => {}} />

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
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/mypage")}
                  />
                </div>
                <div className="myblog-follow-info">
                  <div className="myblog-follow-box">
                    <div className="myblog-follow-label">팔로워</div>
                    <div className="myblog-follow-count">{followerCount}</div>
                  </div>
                  <div className="myblog-follow-box">
                    <div className="myblog-follow-label">팔로잉</div>
                    <div className="myblog-follow-count">{followingCount}</div>
                  </div>
                </div>
              </div>
              <div className="myblog-side-buttons">
                <div
                  onClick={() => navigate("/portfolio")}
                  style={{ cursor: "pointer" }}
                >
                  <GoPortfolio property1="default" />
                </div>
                <div
                  onClick={() => githubUrl && window.open(githubUrl, "_blank")}
                  style={{
                    cursor: githubUrl ? "pointer" : "default",
                    marginLeft: 8,
                  }}
                >
                  <GoGitHub property1="default" />
                </div>
              </div>
            </div>
          </header>

          {/* 게시글 섹션 */}
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
                      key={post.postId}
                      ref={isLast ? lastPostRef : null}
                      onClick={() => navigate(`/viewpost/${post.postId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="myblog-post-image"
                        style={{
                          backgroundColor: "#a3b3bf",
                          backgroundImage: post.thumbnail
                            ? `url(${post.thumbnail})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="myblog-post-content">
                        <p className="myblog-post-snippet">{post.title}</p>
                        <div className="myblog-post-meta">
                          <div className="myblog-post-date">
                            {formatDate(post.createdAt)}
                          {post.createdAt?.split("T")[0].replace(/-/g, ".")  || "날짜 없음"}
                          </div>
                          <div className="myblog-post-comment">
                            <CommentIcon2 className="myblog-comment-icon" />
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
