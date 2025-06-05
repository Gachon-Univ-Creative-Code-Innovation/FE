import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import HotComponent from "../../components/HotComponent/HotComponent";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import FeedComponent from "../../components/FeedComponent/FeedComponent";
import RecommendComponent from "../../components/RecommendComponent/RecommendComponent";
import AllComponent from "../../components/AllComponent/AllComponent";
import MakePortfolioCard from "../../components/MakePortfolioCard/MakePortfolioCard";
import Scrollup from "../../icons/ScrollUp/ScrollUp";
import CommentIcon from "../../icons/CommentIcon/CommentIcon";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import LoginRequiredPopup from "../../components/LoginRequiredPopup/LoginRequiredPopup";
import Navbar from "../../components/Navbar/Navbar";
import "./MainPageBefore.css";
import api from "../../api/local-instance";

export const MainPageBefore = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Hot");
  const [scrolled, setScrolled] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 10;

  const fetchPosts = async (pageNum, tab) => {
    try {
      const token = localStorage.getItem("jwtToken");
      let url = "";
      let params = { page: pageNum };

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
          params.categoryId = 1;
          url = `/blog-service/posts/category/${params.categoryId}`;
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
        const datePart = p.createdAt.split("T")[0];
        const formattedDate = datePart.replace(/-/g, ".");
        return {
          id: p.postId,
          author: p.authorNickname,
          title: p.title,
          content: p.summary,
          imageUrl: p.thumbnail || null,
          date: formattedDate,
          comments: 0,
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
    fetchPosts(0, selectedTab);
  }, [selectedTab]);

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
        <div className="post-img-wrapper">
          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" className="post-img" />
          )}
        </div>
      </div>
    </div>
  );

  const handleReadmeClick = () => {
    const isLoggedIn = false;
    if (isLoggedIn) {
      navigate("/generate-readme");
    } else {
      setShowPopup(true);
    }
  };

  return (
    <PageTransitionWrapper>
      <div className="main-page-before">
        <Navbar
          onShowPopup={() => setShowPopup(true)}
          onReadmeClick={handleReadmeClick}
          scrolled={scrolled}
          isLoggedIn={false}
        />

        <div className="div-2">
          <div className="my-post">
            <p className="p">로그인 후 이용 가능합니다.</p>
            <LoginComponent className="component-1" property1="default" />
          </div>

          <MakePortfolioCard className="component-10" property1="front-real" />

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
                onClick={() => setShowPopup(true)}
              />
              <RecommendComponent
                className="component-instance"
                divClassName="recommendcomponent-text"
                property1={selectedTab === "Recommend" ? "hover" : "default"}
                onClick={() => setShowPopup(true)}
              />
            </div>

            <div className="post-list">
              {posts.map((post, index) => postRender(post, index))}
            </div>

            {!hasMore && (
              <div className="end-message-wrapper">
                <div className="end-message">
                  당신의 이야기를 기다리고 있습니다 ✍️
                </div>
                <div className="sparkle-extra orbit1 sparkle-yellow" />
                <div className="sparkle-extra orbit2 sparkle-yellow" />
                <div className="sparkle-extra orbit3 sparkle-yellow" />
                <div className="sparkle-extra orbit4 sparkle-purple" />
                <div className="sparkle-extra orbit5 sparkle-blue" />
                <div className="sparkle-extra orbit6 sparkle-yellow" />
                <div className="sparkle-extra orbit7 sparkle-blue" />
                <div className="sparkle-extra orbit8 sparkle-purple" />
                <div className="sparkle-extra orbit9 sparkle-purple" />
                <div className="sparkle-extra orbit10 sparkle-pink" />
                <div className="sparkle-extra orbit11 sparkle-pink" />
              </div>
            )}
          </div>

          <div
            className="overlap-wrapper"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="overlap">
              <Scrollup className="component-19" />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showPopup && (
            <LoginRequiredPopup onClose={() => setShowPopup(false)} />
          )}
        </AnimatePresence>
      </div>
    </PageTransitionWrapper>
  );
};

export default MainPageBefore;
