import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const MainPageLoginBefore = () => {
  const postList = [
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
    {
      title: "Title",
      author: "Songhui",
      date: "2025.03.23",
      comments: 0,
      commentIcon: "/img/comment-icon.svg",
    },
  ];

  return (
    <div className="main-page-before">
      <div className="div-2">
        <div className="frame-21">
          <p className="text-wrapper-22">포트폴뤼오</p>
        </div>

        <div className="frame-22">
          <p className="text-wrapper-23">이력서 주세요</p>
        </div>

        <div className="my-post-2">
          <p className="text-wrapper-24">Log in to access more features</p>
          <Link className="frame-23" to="/login">
            <div className="text-wrapper-25">Log in</div>
          </Link>
        </div>

        <img className="pencil-2" alt="Pencil" src="/img/pencil.png" />
        <img className="search-2" alt="Search" src="/img/search.svg" />
        <img
          className="rectangle-16"
          alt="Rectangle"
          src="/img/rectangle-13.svg"
        />
        <div className="text-wrapper-26">Logo</div>

        <div className="frame-24">
          <div className="overlap-12">
            <div className="post-list-wrapper">
              <div className="category-wrapper">
                <div className="category-2">
                  <div className="frame-25">
                    <div className="text-wrapper-27">Hot</div>
                  </div>
                  <div className="frame-26">
                    <div className="text-wrapper-28">All</div>
                  </div>
                  <div className="frame-26">
                    <div className="text-wrapper-29">Category</div>
                  </div>
                  <div className="frame-27">
                    <div className="text-wrapper-30">Feed</div>
                  </div>
                  <div className="frame-28">
                    <div className="text-wrapper-31">Recommend</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="post-list-3">
              {postList.map((post, index) => (
                <div className={`frame-${29 + index}`} key={index}>
                  <div className="overlap-group-5">
                    <div className="text-wrapper-32">{post.title}</div>
                    <div className="comment-3">
                      <img
                        className="comment-icon-2"
                        alt="Comment icon"
                        src={post.commentIcon}
                      />
                      <div className="text-wrapper-33">{post.comments}</div>
                    </div>
                    <div className="text-wrapper-34">{post.date}</div>
                    <div className="rectangle-17" />
                    <div className="author-3">
                      <div className="ellipse-2" />
                      <div className="text-wrapper-35">{post.author}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="frame-40">
                <div className="more-button-2">
                  <div className="text-wrapper-30">More</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-41">
          <div className="frame-42">
            <div className="text-wrapper-36">이력서</div>
          </div>
          <div className="frame-43">
            <div className="text-wrapper-36">포트폴리오</div>
          </div>
          <div className="frame-44">
            <div className="text-wrapper-36">로드맵</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageLoginBefore;
