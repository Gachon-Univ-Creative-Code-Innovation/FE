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

export const MyBlog = () => {
  const navigate = useNavigate();

  // 로그인 토큰만 있으면 내 블로그 접근 가능
  const jwtToken = localStorage.getItem("jwtToken") || "";

  // 프로필 정보 상태
  const [nickname, setNickname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 게시글 상태
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  // 1) 내 정보 & 팔로우/팔로잉 조회
  useEffect(() => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }

    api
      .get("/user-service/user/patch", {
        headers: { Authorization: jwtToken },
      })
      .then((res) => {
        const data = res.data.data;
        setNickname(data.nickname || "");
        setProfileUrl(data.profileUrl || "");
        setGithubUrl(data.githubUrl || "");
      })
      .catch((err) => console.error("내 정보 조회 에러:", err));

    api
      .get("/user-service/follow/followers", {
        headers: { Authorization: jwtToken },
      })
      .then((res) => setFollowerCount((res.data.data || []).length))
      .catch((err) => console.error("팔로워 조회 에러:", err));

    api
      .get("/user-service/follow/followees", {
        headers: { Authorization: jwtToken },
      })
      .then((res) => setFollowingCount((res.data.data || []).length))
      .catch((err) => console.error("팔로잉 조회 에러:", err));
  }, [jwtToken, navigate]);

  // 2) 내 게시글 목록 불러오기
  useEffect(() => {
    if (!jwtToken || !hasMore) return;
    setLoading(true);

    api
      .get(`/blog-service/posts?page=${page}`, {
        headers: { Authorization: jwtToken },
      })
      .then((res) => {
        const data = res.data.data || [];
        setPosts((prev) => [...prev, ...data]);
        if (data.length === 0) {
          setHasMore(false);
        }
      })
      .catch((err) => console.error("게시글 조회 에러:", err))
      .finally(() => setLoading(false));
  }, [page, hasMore, jwtToken]);

  // 3) 무한 스크롤: 마지막 카드 보이면 페이지 증가
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

  return (
    <PageTransitionWrapper>
      {/* 내 블로그이므로 Navbar */}
      <Navbar isLoggedIn={true} onShowPopup={() => {}} />

      <div className="myblog-wrapper">
        <div className="myblog-content-frame">
          {/* 프로필 헤더 */}
          <header className="myblog-header">
            <div className="myblog-profile-container">
              <img
                className="myblog-profile-image"
                alt="Profile"
                src={profileUrl || "/img/default-profile.png"}
                onError={(e) =>
                  (e.currentTarget.src = "/img/default-profile.png")
                }
              />
              <div className="myblog-profile-details">
                <div className="myblog-username-row">
                  <div className="myblog-username">{nickname || "사용자"}</div>
                  {/* 설정 아이콘 */}
                  <SettingIcon
                    className="myblog-icon-subtract"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/mypage")}
                  />
                </div>
                <div className="myblog-follow-info">
                  <div className="myblog-follow-box">
                    <div className="myblog-follow-label">Follower</div>
                    <div className="myblog-follow-count">{followerCount}</div>
                  </div>
                  <div className="myblog-follow-box">
                    <div className="myblog-follow-label">Following</div>
                    <div className="myblog-follow-count">{followingCount}</div>
                  </div>
                </div>
              </div>

              <div className="myblog-side-buttons">
                <div
                  onClick={() => navigate("/portfolio")}
                  style={{ cursor: "pointer" }}
                >
                  <GoPortfolio
                    className="myblog-btn-default"
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
                  <GoGitHub className="myblog-btn-github" property1="default" />
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
                    >
                      <div className="myblog-post-image">
                        <img
                          className="myblog-post-image"
                          alt="Thumbnail"
                          src={post.thumbnail}
                        />
                      </div>
                      <div className="myblog-post-content">
                        <p className="myblog-post-snippet">{post.summary}</p>
                        <div className="myblog-post-meta">
                          <div className="myblog-post-date">
                            {post.createdAt}
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

              {/* 게시글이 없을 때 */}
              {!loading && posts.length === 0 && (
                <div className="myblog-empty-message">
                  당신의 이야기를 기다리고 있습니다 ✍️
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MyBlog;
