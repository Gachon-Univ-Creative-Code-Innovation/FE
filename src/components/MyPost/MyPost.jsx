import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutComponent from "../LogoutComponent/LogoutComponent";
import ComponentSeeAll from "../ComponentSeeAll/ComponentSeeAll";
import MyPostPageIcon from "../../icons/MyPostPageIcon/MyPostPageIcon";
import MyPostPageIcon2 from "../../icons/MyPostPageIcon2/MyPostPageIcon2";
import "./MyPost.css";

export const MyPost = () => {
  const navigate = useNavigate();

  const handleFollowClick = () => {
    navigate("/follow");
  };

  return (
    <div className="my-post-2">
      <header className="header">
        <div className="profile-img" />

        <div className="frame-16">
          <div className="frame-17">
            <div className="frame-18">
              <div className="text-wrapper-38">KimSonghui</div>

              <img
                className="subtract"
                alt="Subtract"
                src="/img/subtract.svg"
              />
            </div>

            <LogoutComponent
              className="component-16-instance"
              divClassName="component-20"
              property1="frame-19"
            />
          </div>

          <div className="follow">
            <div
              className="text-wrapper-39"
              onClick={handleFollowClick}
              style={{ cursor: "pointer" }}
            >
              Follower
            </div>
            <div className="text-wrapper-40">0</div>
            <div
              className="text-wrapper-39"
              onClick={handleFollowClick}
              style={{ cursor: "pointer" }}
            >
              Following
            </div>
            <div className="text-wrapper-40">0</div>
          </div>
        </div>
      </header>

      <div className="body">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={index === 0 ? "post" : "post-2"}>
            <div className="frame-19">
              <div className="text-wrapper-41">[GitHub] 깃허브로 협업하기</div>

              <div className="frame-21">
                <div className="text-wrapper-42">2025.03.23</div>

                <div className="comment-3">
                  <img
                    className="comment-icon-2"
                    alt="Comment icon"
                    src="/img/comment-icon2.svg"
                  />
                  <div className="text-wrapper-43">0</div>
                </div>

                <div className="comment-4">
                  <div className="text-wrapper-42">Views</div>
                  <div className="text-wrapper-44">0</div>
                </div>
              </div>
            </div>

            <div className="rectangle-4" />
          </div>
        ))}
      </div>

      <div className="foot">
        <ComponentSeeAll
          className="component-17-instance"
          property1="frame-20"
        />
        <div className="frame-22">
          <MyPostPageIcon className="component-18-2" />
          <MyPostPageIcon2 className="page-button" />
        </div>
      </div>
    </div>
  );
};

export default MyPost;
