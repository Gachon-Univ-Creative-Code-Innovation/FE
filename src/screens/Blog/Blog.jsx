import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const observer = useRef();
  const jwtToken = localStorage.getItem("jwtToken") || "";

  // 사용자 정보, 팔로잉 상태, 팔로워/팔로잉 수 조회
  useEffect(() => {
    const followConfig = { headers: { Authorization: `Bearer ${jwtToken}` } };

    // 유저 기본 정보
    api
      .get(`/user-service/details/${viewedUserId}`)
      .then((res) => {
        const d = res.data.data || {};
        setNickname(d.nickname || "");
        setProfileUrl(d.profileUrl || "");
        setGithubUrl(d.githubUrl || "");
      })
      .catch((err) => console.error("사용자 정보 조회 실패:", err));

    // 내가 팔로우한 목록에 이 userId가 있는지
    api
      .get(`/user-service/follow/followees`, followConfig)
      .then((res) => {
        const followees = res.data.data || [];
        setIsFollowing(followees.includes(viewedUserId));
      })
      .catch(() => setIsFollowing(false));

    // **팔로워 수 조회** (토큰 인증 불필요)
    api
      .get(`/user-service/follow/followers/${viewedUserId}`)
      .then((res) => {
        const list = res.data.data || [];
        setFollowerCount(list.length);
      })
      .catch((err) => console.error("팔로워 조회 실패:", err));

    // **팔로잉 수 조회**
    api
      .get(`/user-service/follow/followees/${viewedUserId}`, followConfig)
      .then((res) => {
        const list = res.data.data || [];
        setFollowingCount(list.length);
      })
      .catch((err) => console.error("팔로잉 조회 실패:", err));
  }, [viewedUserId, jwtToken]);

  // 게시글 페이징 조회
  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);

    api
      .get(`/blog-service/posts/user/${viewedUserId}?page=${page}`)
      .then((res) => {
        const data = res.data.data.postList || [];
        setPosts((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      })
      .catch((err) => console.error("게시글 조회 실패:", err))
      .finally(() => setLoading(false));
  }, [page, viewedUserId, hasMore]);

  // 무한 스크롤 처리
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

  // 팔로우/언팔로우 핸들러
  const handleFollow = () => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${jwtToken}` } };

    if (isFollowing) {
      api
        .delete(`/user-service/follow`, {
          ...config,
          data: { followeeId: viewedUserId },
        })
        .then(() => setIsFollowing(false))
        .catch((err) => console.error("언팔로우 실패:", err));
    } else {
      api
        .post(`/user-service/follow`, { followeeId: viewedUserId }, config)
        .then(() => setIsFollowing(true))
        .catch((err) => console.error("팔로우 실패:", err));
    }
  };

  // 포트폴리오 이동
  const handlePortfolioClick = () => {
    api
      .get("/portfolio-service/user", {
        params: { userID: viewedUserId },
        headers: { accept: "application/json" },
      })
      .then((res) => {
        const { status, data } = res.data;
        if (status === 200 && data) navigate(`/portfolio/view/${data}`);
        else navigate("/portfolio");
      })
      .catch(() => navigate("/portfolio"));
  };

  // 쪽지 이동
  const handleChatClick = () => {
    if (!jwtToken) return navigate("/login");
    navigate(`/message-room/${viewedUserId}`);
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="blog-wrapper">
        <div className="blog-content-frame">
          <header className="blog-header">
            <div className="blog-profile-container">
              <div
                className="blog-profile-image"
                style={{
                  backgroundImage: profileUrl ? `url(${profileUrl})` : "none",
                }}
              />
              <div className="blog-profile-details">
                <div className="blog-top-row">
                  <div className="blog-username">{nickname || "사용자"}</div>
                  <div className="blog-action-buttons">
                    <FollowButton
                      isFollowing={isFollowing}
                      onClick={handleFollow}
                    />
                  </div>
                </div>
                <div className="blog-bottom-buttons">
                  <button
                    className="blog-btn-unified"
                    onClick={handlePortfolioClick}
                  >
                    포트폴리오
                  </button>
                  <button
                    className="blog-btn-unified"
                    onClick={() =>
                      githubUrl && window.open(githubUrl, "_blank")
                    }
                    disabled={!githubUrl}
                  >
                    깃허브
                  </button>
                  <button
                    className="blog-btn-unified"
                    onClick={handleChatClick}
                  >
                    쪽지 보내기
                  </button>
                </div>
                {/* 팔로워/팔로잉 통계 */}
                <div className="blog-follow-stats">
                  <div className="blog-follow-box">
                    <div className="blog-follow-label">팔로워</div>
                    <div className="blog-follow-count">{followerCount}</div>
                  </div>
                  <div className="blog-follow-box">
                    <div className="blog-follow-label">팔로잉</div>
                    <div className="blog-follow-count">{followingCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* 게시글 리스트 */}
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
                      onClick={() => navigate(`/viewpost/${post.postId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="blog-post-image"
                        style={{
                          backgroundImage: post.thumbnail
                            ? `url(${post.thumbnail})`
                            : "url('/img/blog_basic_photo.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="blog-post-content">
                        <p className="blog-post-snippet">{post.title}</p>
                        <div className="blog-post-meta">
                          <div className="blog-post-date">
                            {post.createdAt?.split("T")[0].replace(/-/g, ".") ||
                              "날짜 없음"}
                          </div>
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
