import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import "./MainPageAfter.css";
import api from "../../api/local-instance";



export const MainPageAfter = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Hot");
  const [scrolled, setScrolled] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 10;
  const MAX_PAGES = 5;


  const fetchPosts = async (pageNum, tab) => {
    try {
      const token = localStorage.getItem("jwtToken");
      let url = "";
      let params = { page: pageNum};

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
          params.categoryId = 1; // 임시로 1번 카테고리로 설정
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
          date: formattedDate,
          comments: 0,    // DTO에 댓글 개수 필드가 없다면 0으로 두거나, 실제 필드명으로 수정
          views: p.view,
        };
      });

      // 페이지 0은 완전히 초기 상태이므로 덮어쓰기
      // 그 외 페이지는 기존 포스트 뒤에 붙이기
      setPosts((prev) => (pageNum === 0 ? newPosts : [...prev, ...newPosts]));

      // 마지막 페이지인지 확인
      if (getPostList.isLast || newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      setHasMore(false);
    }
  };

  // 1) 탭이 변경될 때마다: posts 초기화, page=1, hasMore=true, 그리고 첫 페이지 데이터 로드
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(page, selectedTab);
  }, [selectedTab]);

  // 2) page가 변경될 때마다(탭 변경 시 첫 페이지 로드는 위 useEffect에서, 
  //    이후 무한 스크롤로 page가 +1 될 때마다 이쪽에서 추가 로드)
  useEffect(() => {
    if (page !== 0 && hasMore) {
      fetchPosts(page, selectedTab);
    }
  }, [page]);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lastPostRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const postRender = (post, index) => (
    <div key={post.id} ref={index === posts.length - 1 ? lastPostRef : null}>
      <div className="frame-2">
        <div className="frame-3">
          <div className="author">
            <div className="frame-4">
              <div className="ellipse" />
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
        <div className="rectangle" />
      </div>
    </div>
  );

  const handleReadmeClick = () => {
    navigate("/generate-readme");
  };

  const handlePortfolioClick = () => {
    navigate("/portfolio");
  };

  return (
    <PageTransitionWrapper>
      <div className="main-page-after">
        <Navbar
          onReadmeClick={handleReadmeClick}
          onShowPopup={() => {}}
          scrolled={scrolled}
          isLoggedIn={true}
        />

        <div className="div-2">
          <div className="my-post-wrapper">
            <MyPost />
          </div>

          <MakePortfolioCard
            className="component-15"
            property1="front-real"
            onClick={handlePortfolioClick}
          />

          <div className="post-list-hot">
            <div className="category">
              <HotComponent
                className="component-instance"
                divClassName="hotcomponent-text"
                property1={selectedTab === "Hot" ? "hover" : "default"}
                onClick={() => setSelectedTab("Hot")}
              />
              <AllComponent
                className="component-instance"
                divClassName="allcomponent-text"
                property1={selectedTab === "All" ? "hover" : "default"}
                onClick={() => setSelectedTab("All")}
              />
              <CategoryComponent
                className="component-instance"
                divClassName="categorycomponent-text"
                property1={selectedTab === "Category" ? "hover" : "default"}
                onClick={() => setSelectedTab("Category")}
              />
              <FeedComponent
                className="component-instance"
                divClassName="feedcomponent-text"
                property1={selectedTab === "Feed" ? "hover" : "default"}
                onClick={() => setSelectedTab("Feed")}
              />
              <RecommendComponent
                className="component-instance"
                divClassName="recommendcomponent-text"
                property1={selectedTab === "Recommend" ? "hover" : "default"}
                onClick={() => setSelectedTab("Recommend")}
              />
            </div>

            <div className="post-list">
              {posts.map((post, index) => postRender(post, index))}
            </div>

            {!hasMore && (
              <div className="end-message">더 이상 게시글이 없습니다.</div>
            )}
          </div>

          <div className="overlap-wrapper">
            <div className="overlap">
              <ScrollUp className="component-19" />
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MainPageAfter;
