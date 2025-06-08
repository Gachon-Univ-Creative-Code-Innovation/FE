import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoGitHub from "../../components/GoGitHub/GoGitHub";
import GoPortfolio from "../../components/GoPortfolio/GoPortfolio";
import Navbar from "../../components/Navbar/Navbar";
import SearchModal from "../../components/SearchModal/SearchModal";
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

  // 검색 관련 상태
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  // 프로필 & 팔로우 정보 조회
  useEffect(() => {
    if (!jwtToken) return navigate("/login");
    const headers = { Authorization: jwtToken };

    const fetchProfile =
      authorId == null
        ? api.get("/user-service/user/patch", { headers })
        : api.get(`/user-service/details/${authorId}`, { headers });

    fetchProfile
      .then((res) => {
        const d = res.data.data || {};
        setNickname(d.nickname || "");
        setProfileUrl(d.profileUrl || "");
        setGithubUrl(d.githubUrl || "");
      })
      .catch((err) => console.error("프로필 조회 에러:", err));

    const fetchFollowers =
      authorId == null
        ? api.get("/user-service/follow/followers", { headers })
        : api.get(`/user-service/follow/followers/${authorId}`, { headers });

    fetchFollowers
      .then((res) => setFollowerCount((res.data.data || []).length))
      .catch((err) => console.error("팔로워 조회 에러:", err));

    const fetchFollowing =
      authorId == null
        ? api.get("/user-service/follow/followees", { headers })
        : api.get(`/user-service/follow/followees/${authorId}`, { headers });

    fetchFollowing
      .then((res) => setFollowingCount((res.data.data || []).length))
      .catch((err) => console.error("팔로잉 조회 에러:", err));
  }, [authorId, jwtToken, navigate]);

  // 게시글 불러오기 (검색 or 기본)
  useEffect(() => {
    if (!jwtToken || !hasMore) return;
    setLoading(true);

    let url = "";
    const params = { page };

    if (isSearching && searchQuery) {
      url = "/blog-service/posts/search";
      params.q = searchQuery;
    } else if (authorId == null) {
      url = "/blog-service/posts";
    } else {
      url = `/blog-service/posts/user/${authorId}`;
    }

    api
      .get(url, { headers: { Authorization: jwtToken }, params })
      .then((res) => {
        const data = isSearching
          ? res.data.data.results || []
          : res.data.data.postList || [];
        setPosts((prev) => (page === 0 ? data : [...prev, ...data]));
        if (data.length === 0) setHasMore(false);
      })
      .catch((err) => {
        console.error("게시글 조회 에러:", err);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [authorId, jwtToken, page, hasMore, isSearching, searchQuery]);

  // 무한 스크롤 옵저버
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
      <Navbar
        isLoggedIn
        onSearch={() => {
          setSearchOpen(true);
          setSearchQuery("");
          setIsSearching(false);
        }}
        onShowPopup={() => {}}
      />

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
                <div className="myblog-post-title">
                  {isSearching ? `검색 결과: "${searchQuery}"` : "최신글"}
                </div>
              </div>
            </div>
            <div className="myblog-post-list">
              <div className="myblog-post-grid">
                {posts.map((post, i) => {
                  const isLast = i === posts.length - 1;
                  return (
                    <div
                      className="myblog-post-card"
                      key={post.postId || post.id}
                      ref={isLast ? lastPostRef : null}
                      onClick={() =>
                        navigate(`/viewpost/${post.postId || post.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="myblog-post-image"
                        style={{
                          backgroundColor: "#a3b3bf",
                          backgroundImage: post.thumbnail
                            ? `url(${post.thumbnail})`
                            : "url('/img/blog_basic_photo.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="myblog-post-content">
                        <p className="myblog-post-snippet">
                          {post.title || post.title}
                        </p>
                        <div className="myblog-post-meta">
                          <div className="myblog-post-date">
                            {formatDate(post.createdAt || post.date)}
                          </div>
                          <div className="myblog-post-comment">
                            <CommentIcon2 className="myblog-comment-icon" />
                            <div className="myblog-comment-count">
                              {post.commentCount || post.comments}
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

      {/* 검색 모달 */}
      {searchOpen && (
        <SearchModal
          initialValue={searchQuery}
          onClose={() => setSearchOpen(false)}
          onSearch={(q) => {
            setSearchQuery(q);
            setIsSearching(true);
            setPosts([]);
            setPage(0);
            setHasMore(true);
            setSearchOpen(false);
          }}
        />
      )}
    </PageTransitionWrapper>
  );
};

export default MyBlog;
