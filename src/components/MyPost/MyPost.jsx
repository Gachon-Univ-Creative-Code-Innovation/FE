import React from "react";
import LogoutComponent from "../LogoutComponent/LogoutComponent";
import ComponentSeeAll from "../ComponentSeeAll/ComponentSeeAll";
import Component18_2 from "../../icons/Component18_2/Component18_2";
import Property1Default from "../../icons/Property1Default/Property1Default";
import "./MyPost.css";

export const MyPost = () => {
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
            <div className="text-wrapper-39">Follower</div>
            <div className="text-wrapper-40">0</div>
            <div className="text-wrapper-39">Following</div>
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
          <Component18_2 className="component-18-2" />
          <Property1Default className="page-button" />
        </div>
      </div>
    </div>
  );
};

export default MyPost;
