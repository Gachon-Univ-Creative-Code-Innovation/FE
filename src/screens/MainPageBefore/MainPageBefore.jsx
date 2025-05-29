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

const generatePosts = (startId, count) =>
  Array.from({ length: count }).map((_, i) => ({
    id: startId + i,
    author: "Songhui",
    title: "[GitHub] 깃허브로 협업하기",
    content: "Github".repeat(3),
    date: "2025.03.23",
    comments: 0,
    views: 0,
  }));

export const MainPageBefore = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Hot");
  const [scrolled, setScrolled] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 10;
  const MAX_PAGES = 5;

  const fetchPosts = (pageNum) => {
    if (pageNum > MAX_PAGES) {
      setHasMore(false);
      return;
    }
    const newPosts = generatePosts(
      (pageNum - 1) * POSTS_PER_PAGE,
      POSTS_PER_PAGE
    );
    setPosts((prev) => [...prev, ...newPosts]);
  };

  useEffect(() => {
    fetchPosts(page);
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
            <p className="p">Log in to access more features</p>
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
