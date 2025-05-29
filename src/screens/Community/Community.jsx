import React from "react";
import RecruitButton from "../../components/RecruitButton/RecruitButton";
import Navbar2 from "../../components/Navbar2/Navbar2";
import CommunityText from "../../components/CommunityText/CommunityText";
import CommunityTab from "../../components/CommunityTab/CommunityTab";
import CommunityPostList from "../../components/CommunityPostList/CommunityPostList";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./Community.css";

export const Community = () => {
  return (
    <PageTransitionWrapper>
      <div className="community-wrapper">
        <Navbar2 className="community-image" />
        <div className="community-frame-outer">
          <CommunityText />
          <div className="community-frame-keyword">
            <div className="community-keyword-box">
              <input
                type="text"
                className="community-input"
                placeholder="관심있는 키워드를 입력하세요"
              />
              <div className="community-search-btn-wrapper">
                <div className="community-search-text">검색</div>
              </div>
            </div>

            <RecruitButton
              className="community-btn-instance"
              divClassName="community-btn-inner"
              property1="default"
            />
          </div>

          <CommunityTab />
          <CommunityPostList />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Community;
