import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GoGitHub from "../../components/GoGitHub/GoGitHub";
import GoPortfolio from "../../components/GoPortfolio/GoPortfolio";
import Navbar from "../../components/Navbar/Navbar";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SettingIcon from "../../icons/SettingIcon/SettingIcon";
import CommentIcon2 from "../../icons/CommentIcon2/CommentIcon2";
import api from "../../api/instance"; // API 인스턴스
import "./MyBlog.css";

export const MyBlog = () => {
  const navigate = useNavigate();

  // 사용자 정보 상태
  const [nickname, setNickname] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 게시글 상태: 리스트, 페이지, 로딩, 추가 데이터 여부
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  useEffect(() => {
    // 사용자 정보 조회
    api
      .get("/user-service/user/patch")
      .then((res) => {
        const data = res.data.data;
        setNickname(data.nickname || "");
        setProfileUrl(data.profileUrl || "");
        setGithubUrl(data.githubUrl || "");
      })
      .catch((err) => console.error("사용자 정보 조회 실패:", err));

    // 팔로워 수 조회
    api
      .get("/user-service/follow/followers")
      .then((res) => setFollowerCount((res.data.data || []).length))
      .catch((err) => console.error("팔로워 조회 실패:", err));

    // 팔로잉 수 조회
    api
      .get("/user-service/follow/followees")
      .then((res) => setFollowingCount((res.data.data || []).length))
      .catch((err) => console.error("팔로잉 조회 실패:", err));
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    setLoading(true);
    // 게시글 페이지별 조회
    api
      .get(`/blog-service/posts?page=${page}`)
      .then((res) => {
        const data = res.data.data || [];
        setPosts((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      })
      .catch((err) => console.error("게시글 조회 실패:", err))
      .finally(() => setLoading(false));
  }, [page]);

  // 마지막 게시글 감지
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
      <Navbar isLoggedIn={true} onShowPopup={() => {}} />
      <div className="myblog-wrapper">
        <div className="myblog-content-frame">
          <header className="myblog-header">
            <div className="myblog-profile-container">
              {/* 프로필 이미지 */}
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
                  {/* 닉네임 */}
                  <div className="myblog-username">{nickname || "사용자"}</div>
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
                {/* 포트폴리오 이동 */}
                <div
                  onClick={() => navigate("/portfolio")}
                  style={{ cursor: "pointer" }}
                >
                  <GoPortfolio
                    className="myblog-btn-default"
                    property1="default"
                  />
                </div>
                {/* GitHub 이동 */}
                <div
                  onClick={() => githubUrl && window.open(githubUrl, "_blank")}
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
                {!loading && posts.length === 0 && (
                  <div>게시글이 없습니다.</div>
                )}
                {loading && <div>로딩 중...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MyBlog;
