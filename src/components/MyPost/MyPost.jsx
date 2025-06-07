import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutComponent from "../LogoutButtonComponent/LogoutButtonComponent";
import ComponentSeeAll from "../ComponentSeeAll/ComponentSeeAll";
import MyPostPageIcon from "../../icons/MyPostPageIcon/MyPostPageIcon";
import MyPostPageIcon2 from "../../icons/MyPostPageIcon2/MyPostPageIcon2";
import CommentIcon2 from "../../icons/CommentIcon2/CommentIcon2";
import api from "../../api/instance";
import "./MyPost.css";

export const MyPost = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    profileUrl: "",
    followers: 0,
    following: 0,
  });

  const handleFollowClick = () => navigate("/follow");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/user/main", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { nickname, profileUrl, followers, following } = res.data.data;
        setUserInfo({ nickname, profileUrl, followers, following });
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="mypost-wrapper">
      <header className="mypost-header">
        <div className="mypost-profile-img">
          {userInfo.profileUrl ? (
            <img
              src={userInfo.profileUrl}
              alt="프로필 이미지"
              className="mypost-profile-img-tag"
            />
          ) : (
            <div className="mypost-profile-placeholder" />
          )}
        </div>

        <div className="mypost-userinfo">
          <div className="mypost-top">
            <div className="mypost-name-wrapper">
              <div
                className="mypost-nickname"
                onClick={() => navigate("/mypage")}
                style={{ cursor: "pointer" }}
              >
                {userInfo.nickname}
              </div>
            </div>

            <LogoutComponent
              className="mypost-logout"
              divClassName="mypost-logout-text"
              property1="frame-19"
            />
          </div>

          <div className="mypost-follow">
            <div className="mypost-label" onClick={handleFollowClick}>
              팔로워
            </div>
            <div className="mypost-count">{userInfo.followers}</div>

            <div className="mypost-divider" />

            <div className="mypost-label" onClick={handleFollowClick}>
              팔로잉
            </div>
            <div className="mypost-count">{userInfo.following}</div>
          </div>
        </div>
      </header>

      <div className="mypost-body">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={index === 0 ? "mypost-post" : "mypost-post-2"}
          >
            <div className="mypost-post-info">
              <div className="mypost-title">[GitHub] 깃허브로 협업하기</div>
              <div className="mypost-meta">
                <div className="mypost-date">2025.03.23</div>
                <div className="mypost-comment">
                  <CommentIcon2 className="mypost-comment-icon" />
                  <div className="mypost-comment-count">0</div>
                </div>
                <div className="mypost-views">
                  <div className="mypost-date">조회수</div>
                  <div className="mypost-views-count">0</div>
                </div>
              </div>
            </div>
            <div className="mypost-thumbnail" />
          </div>
        ))}
      </div>

      <div className="mypost-footer">
        {/* See All 클릭시 마이블로그 이동*/}
        <div onClick={() => navigate("/myblog")} style={{ cursor: "pointer" }}>
          <ComponentSeeAll className="mypost-seeall" property1="frame-20" />
        </div>
      </div>
    </div>
  );
};

export default MyPost;
