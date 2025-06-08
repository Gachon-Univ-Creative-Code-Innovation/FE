import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import MyPost from "../../components/MyPost/MyPost";
import HotComponent from "../../components/HotComponent/HotComponent";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import FeedComponent from "../../components/FeedComponent/FeedComponent";
import RecommendComponent from "../../components/RecommendComponent/RecommendComponent";
import AllComponent from "../../components/AllComponent/AllComponent";
import MakePortfolioCard from "../../components/MakePortfolioCard/MakePortfolioCard";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import CommentIcon from "../../icons/CommentIcon/CommentIcon";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import SearchModal from "../../components/SearchModal/SearchModal";
import api from "../../api/instance";
import "./MainPageAfter.css";

// 블로그에서 사용하는 카테고리만 (스터디, 공모전 제외)
const BLOG_CATEGORY_LIST = [
  { code: 1, label: "개발" },
  { code: 2, label: "클라우드 & 인프라" },
  { code: 3, label: "AI" },
  { code: 4, label: "데이터베이스" },
  { code: 5, label: "CS 지식" },
  { code: 6, label: "프로젝트" },
  { code: 7, label: "문제해결(트러블 슈팅)" },
  { code: 8, label: "성장 기록" },
  { code: 9, label: "IT 뉴스" },
  { code: 10, label: "기타" },
];

// 파도타기 효과 컴포넌트
// 물결 애니메이션
const WaveText = ({ text, className }) => {
  const [wave, setWave] = useState(false);

  useEffect(() => {
    const loop = () => {
      setWave(true);
      setTimeout(() => {
        setWave(false);
        setTimeout(loop, 3000);
      }, (text.length * 0.15 + 0.6) * 1000);
    };
    const t = setTimeout(loop, 1000);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <div className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className={`wave-letter ${wave ? "wave-animate" : ""}`}
          style={{ "--delay": `${i * 0.15}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
};

export const MainPageAfter = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [tab, setTab] = useState("Hot");
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); //추가
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();
  const PER_PAGE = 10;

  const POSTS_PER_PAGE = 10;
  const MAX_PAGES = 5;

  const fetchPosts = async (pageNum, tab, categoryId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      let url = "";
      let params = { page: pageNum };
      console.log("Fetching posts for tab:", tab, "Page:", pageNum, "Category:", categoryId);

      switch (tab) {
        case "Hot":
          url = "/blog-service/posts/trending";
          params.postType = "POST";
          break;

        case "All":
          url = "/blog-service/posts/all";
          params.postType = "POST";
          break;

        case "Category":
          params.categoryId = categoryId || 1; // 선택된 카테고리, 없으면 1번
          url = `/blog-service/posts/category/${params.categoryId}`;
          break;

        case "Feed":
          url = "/blog-service/posts/following";
          break;

        case "Recommend":
          url = "/blog-service/posts/recommend";
          break;

        default:
          url = "/blog-service/posts/all";
          params.postType = "POST";
      }
      if (t === "Feed") url = "/blog-service/posts/following";
      if (t === "Recommend") url = "/blog-service/posts/recommend";

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const getPostList = response.data.data;
      const rawPosts = getPostList.postList;

      const newPosts = rawPosts.map((p) => {
        // createdAt: "2025-05-28T02:28:34.515139"
        const datePart = p.createdAt.split("T")[0]; // "2025-05-28"
        const formattedDate = datePart.replace(/-/g, "."); // "2025.05.28"

        return {
          id: p.postId,
          author: p.authorNickname,
          title: p.title,
          content: p.summary,
          profileUrl: p.profileUrl,
          imageUrl: p.thumbnail || null, // 이미지가 없을 경우 null 처리
          date: formattedDate,
          comments: p.commentCount, // DTO에 댓글 개수 필드가 없다면 0으로 두거나, 실제 필드명으로 수정
          views: p.view,
        };
      });

      setPosts((prev) => (pageNum === 0 ? newPosts : [...prev, ...newPosts]));

      if (getPostList.isLast || newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0, selectedTab, selectedCategory);
  }, [selectedTab, selectedCategory]);

  useEffect(() => {
    if (page !== 0 && hasMore) {
      fetchPosts(page, selectedTab, selectedCategory);
    }
  }, [page, hasMore, tab]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lastRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const renderPost = (post, idx) => (
    <div
      key={post.id}
      ref={idx === posts.length - 1 ? lastRef : null}
      onClick={() => navigate(`/viewpost/${post.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="frame-2">
        <div className="frame-3">
          <div className="author">
            <div className="frame-4">
              <div className="author-profile-wrapper">
                <img
                  src={post.profileUrl || "/img/basic_profile_photo.png"}
                  alt="author"
                  className="author-profile-img"
                  onError={(e) =>
                    (e.currentTarget.src = "/img/basic_profile_photo.png")
                  }
                />
              </div>
              <div className="text-wrapper-10">{post.author}</div>
            </div>
          </div>
          <div className="frame-5">
            <div className="div-wrapper">
              <div className="text-wrapper-11">{post.title}</div>
            </div>
            <div className="text-wrapper-12">{post.content}</div>
          </div>
          <div className="frame-6">
            <div className="text-wrapper-13">{post.date}</div>
            <div className="comment">
              <CommentIcon className="comment-icon" />
              <div className="text-wrapper-14">{post.comments}</div>
            </div>
            <div className="comment-2">
              <div className="text-wrapper-13">Views</div>
              <div className="text-wrapper-15">{post.views}</div>
            </div>
          </div>
        </div>
        <div className="post-img-wrapper">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt="post"
              className="post-img"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%" }} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PageTransitionWrapper>
      <div className="main-page-after">
        <Navbar
          onSearch={() => setSearchOpen(true)}
          onReadmeClick={() => navigate("/generate-readme")}
          scrolled={scrolled}
          isLoggedIn
        />

        <div className="div-2">
          <div className="my-post-wrapper">
            <MyPost />
          </div>

          <MakePortfolioCard
            className="component-15"
            property1="front-real"
            onClick={() => navigate("/portfolio")}
          />

          <div className="post-list-hot">
            <div className="category">
              {["Hot", "All", "Category", "Feed", "Recommend"].map((t) => {
                const Comp = {
                  Hot: HotComponent,
                  All: AllComponent,
                  Category: CategoryComponent,
                  Feed: FeedComponent,
                  Recommend: RecommendComponent,
                }[t];
                return (
                  <Comp
                    key={t}
                    className="component-instance"
                    divClassName={`${t.toLowerCase()}-text`}
                    property1={tab === t ? "hover" : "default"}
                    onClick={() => setTab(t)}
                  />
                );
              })}
            </div>

            {/* 카테고리 탭일 때만 드롭다운 노출 */}
            {selectedTab === "Category" && (
              <div style={{ margin: "16px 0" }}>
                <select
                  value={selectedCategory || ""}
                  onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  style={{ fontSize: 16, padding: 6, borderRadius: 6 }}
                >
                  <option value="">카테고리 선택</option>
                  {BLOG_CATEGORY_LIST.map(cat => (
                    <option key={cat.code} value={cat.code}>{cat.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="post-list">
              {posts.map((post, index) => renderPost(post, index))}
            </div>

            {!hasMore && (
              <div className="end-message-wrapper">
                <WaveText
                  text="당신의 이야기를 기다리고 있습니다 ✍️"
                  className="end-message"
                />
              </div>
            )}
          </div>

          <div
            className="overlap-wrapper"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ScrollUp className="component-19" />
          </div>
        </div>

        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </div>
    </PageTransitionWrapper>
  );
};

export default MainPageAfter;
