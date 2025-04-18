import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import FeedComponent from "../../components/FeedComponent/FeedComponent";
import RecommnedComponent from "../../components/RecommendComponent/RecommendComponent";
import PortfolioComponent from "../../components/PortfolioComponent/PortfolioComponent";
import ReadmeComponent from "../../components/ReadmeComponent/ReadmeComponent";
import RoadmapComponent from "../../components/RoadmapComponent/RoadmapComponent";
import AllComponent from "../../components/AllComponent/AllComponent";
import MyBlogComponent from "../../components/MyBlogComponent/MyBlogComponent";
import PropertyHoverWrapper from "../../components/PropertyHoverWrapper/PropertyHoverWrapper";
import Scrollup from "../../icons/ScrollUp/ScrollUp";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import NoticeBell from "../../icons/NoticeBell/NoticeBell";
import LoginRequiredPopup from "../../components/LoginRequiredPopup/LoginRequiredPopup";
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
              <img
                className="comment-icon"
                alt="Comment icon"
                src="/img/comment-icon-12.png"
              />
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
    const isLoggedIn = false; // 실제 로그인 상태는 localStorage 또는 context에서 가져오기
    if (isLoggedIn) {
      navigate("/generate-readme");
    } else {
      setShowPopup(true);
    }
  };

  return (
    <PageTransitionWrapper>
      <div className="main-page-before">
        <div className="navbar">
          <div className="frame-7">
            <img
              className="alog-logo"
              alt="Alog logo"
              src="/img/alog-logo.png"
              onClick={() => navigate("/MainPagebefore")}
              style={{ cursor: "pointer" }}
            />
            <div className="frame-8">
              <MyBlogComponent property1="frame-117" />
              <ReadmeComponent
                className="component-6"
                divClassName="component-11"
                property1="default"
                onClick={handleReadmeClick} // 클릭 이벤트 연결
              />
              <PortfolioComponent
                className="component-6"
                divClassName="component-11"
                property1="default"
              />
              <RoadmapComponent
                className="component-6"
                divClassName="component-11"
                property1="default"
              />
            </div>
            <div className="frame-9">
              <img className="icon" alt="Icon" src="/img/icon.svg" />
              <NoticeBell
                className="img"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const isLoggedIn = false;
                  if (isLoggedIn) {
                    navigate("/notice");
                  } else {
                    setShowPopup(true);
                  }
                }}
              />

              <div
                className="mode-edit"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPopup(true)}
              >
                <div className="group">
                  <div className="overlap-group-wrapper">
                    <div className="overlap-group">
                      <img
                        className="group-2"
                        alt="Group"
                        src="/img/group-1.png"
                      />
                      <img
                        className="group-3"
                        alt="Group"
                        src="/img/group-2.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="div-2">
          <div className="my-post">
            <p className="p">Log in to access more features</p>
            <LoginComponent className="component-1" property1="default" />
          </div>

          <PropertyHoverWrapper
            className="component-10"
            property1="front-real"
          />

          <div className="post-list-hot">
            <div className="category">
              <div className="frame">
                <div className="text-wrapper-9">Hot</div>
              </div>
              <AllComponent
                className="component-instance"
                divClassName="component-2"
                property1="default"
              />
              <CategoryComponent
                className="component-instance"
                divClassName="component-3-instance"
                property1="default"
              />
              <FeedComponent
                className="component-instance"
                divClassName="component-4-instance"
                property1="default"
              />
              <RecommnedComponent
                className="component-5-instance"
                divClassName="design-component-instance-node"
                property1="default"
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
              <div className="text">{""}</div>
              <Scrollup className="component-19" />
            </div>
          </div>
        </div>

        {/* 팝업 렌더링 */}
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
