import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruitButton from "../../components/RecruitButton/RecruitButton";
import Navbar2 from "../../components/Navbar2/Navbar2";
import CommunityText from "../../components/CommunityText/CommunityText";
import CommunityTab from "../../components/CommunityTab/CommunityTab";
import CommunityPostList from "../../components/CommunityPostList/CommunityPostList";
import SortButton from "../../components/SortButton/SortButton";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./Community.css";

export const Community = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");

  const handleRecruitClick = () => {
    navigate("/community/write");
  };

  return (
    <PageTransitionWrapper>
      <div className="community-wrapper">
        <Navbar2 className="community-image" />
        <div className="community-frame-outer">
          <CommunityText />

          {/* 검색창 + 모집 버튼 */}
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
              onClick={handleRecruitClick}
            />
          </div>

          <CommunityTab 
            selectedTab={selectedTab}
            onTabChange={(tab) => setSelectedTab(tab)}
          />
          {/*검색할 때에만 보이게하면 안될까요? - 기본 글 목록 조회시에는 최신순으로만 보여줌!*/}
          <div className="community-frame-sort">
            <SortButton onChange={(option) => setSelectedSort(option)} />
          </div>

          <CommunityPostList sortBy={selectedSort} category = {selectedTab} />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Community;