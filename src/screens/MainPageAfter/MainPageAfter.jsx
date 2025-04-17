import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Component3 from "../../components/CategoryComponent/CategoryComponent";
import Component4 from "../../components/FeedComponent/FeedComponent";
import Component5 from "../../components/RecomendComponent/RecomendComponent";
import Component8 from "../../components/PortfolioComponent/PortfolioComponent";
import Component9 from "../../components/RoadmapComponent/RoadmapComponent";
import PropertyDefaultWrapper from "../../components/AllComponent/AllComponent";
import PropertyFrameWrapper from "../../components/PropertyFrameWrapper/PropertyFrameWrapper";
import PropertyHoverWrapper from "../../components/PropertyHoverWrapper/PropertyHoverWrapper";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import NoticeBell from "../../icons/NoticeBell/NoticeBell";
import MyPost from "../../components/MyPost/MyPost";
import "./MainPageAfter.css";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";

export const MainPageAfter = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 10;
  const MAX_PAGES = 5;

  const fetchPosts = (pageNum) => {
    if (pageNum > MAX_PAGES) {
      setHasMore(false);
      return;
    }
    const newPosts = Array.from({ length: POSTS_PER_PAGE }).map((_, i) => ({
      id: (pageNum - 1) * POSTS_PER_PAGE + i,
      author: "Songhui",
      title: "[GitHub] 깃허브로 협업하기",
      content: "Github".repeat(3),
      date: "2025.03.23",
      comments: 0,
      views: 0,
    }));
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

  return (
    <PageTransitionWrapper>
      <div className="main-page-after">
        <div className="navbar">
          <div className="frame-7">
            <img
              className="alog-logo"
              alt="Alog logo"
              src="/img/alog-logo.png"
              onClick={() => navigate("/MainPageBefore")}
              style={{ cursor: "pointer" }}
            />
            <div className="frame-8">
              <PropertyFrameWrapper property1="frame-117" />
              <Component8
                className="component-6"
                divClassName="component-11"
                property1="default"
              />
              <Component9
                className="component-6"
                divClassName="component-11"
                property1="default"
              />
            </div>
            <div className="frame-9">
              <img className="icon" alt="Icon" src="/img/icon.svg" />
              <NoticeBell className="img" />
              <div className="mode-edit">
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
          <PropertyHoverWrapper
            className="component-15"
            property1="front-real"
          />

          <div className="my-post-wrapper">
            <MyPost />
          </div>

          <div className="post-list-hot">
            <div className="category">
              <div className="frame">
                <div className="text-wrapper-9">Hot</div>
              </div>
              <PropertyDefaultWrapper
                className="component-instance"
                divClassName="component-2"
                property1="default"
              />
              <Component3
                className="component-instance"
                divClassName="component-3-instance"
                property1="default"
              />
              <Component4
                className="component-instance"
                divClassName="component-4-instance"
                property1="default"
              />
              <Component5
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
              <ScrollUp className="component-19" />
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MainPageAfter;
