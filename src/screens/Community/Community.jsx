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
import api from "../../api/instance";

const COMMUNITY_CATEGORIES = [
  { key: null, label: "전체" },
  { key: 1, label: "프로젝트" },
  { key: 2, label: "스터디" },
  { key: 3, label: "공모전" },
  { key: 4, label: "기타" },
];

const SORT_MAP = {
  "최신순": 2,
  "오래된순": 1, // 명세상 오래된순이 없으면 관련도순(1)로 대체
  "추천순": 3,
};

export const Community = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchPage, setSearchPage] = useState(0);
  const [searchTotalPages, setSearchTotalPages] = useState(0);

  const handleRecruitClick = () => {
    navigate("/community/write");
  };

  // 검색 API 호출
  const handleSearch = async (page = 0) => {
    console.log('검색어:', searchKeyword);
    if (!searchKeyword.trim()) return;
    try {
      const res = await api.get("/blog-service/posts/search/matching", {
        params: {
          keyword: searchKeyword,
          sortBy: SORT_MAP[selectedSort],
          page,
        },
      });
      setSearchResults(res.data.postList);
      setSearchPage(res.data.pageNumber);
      setSearchTotalPages(res.data.totalPages);
    } catch {
      setSearchResults([]);
    }
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
              <SortButton onChange={setSelectedSort} />
              <input
                type="text"
                className="community-input"
                placeholder="관심있는 키워드를 입력하세요"
                value={searchKeyword}
                onChange={e => {
                  setSearchKeyword(e.target.value);
                  setSearchResults(null); // 검색어 바뀔 때마다 결과 초기화
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") handleSearch(0);
                }}
              />
              <div className="community-search-btn-wrapper" onClick={() => handleSearch(0)}>
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

          {/* 기존 CommunityTab 컴포넌트 활용, 카테고리 5개만 */}
          <CommunityTab
            categories={COMMUNITY_CATEGORIES}
            selectedTab={selectedCategory}
            onTabChange={setSelectedCategory}
          />



          {/* 검색어가 있으면 검색 결과만, 없으면 기존 카테고리별 목록 */}
          {searchKeyword.trim() ? (
            <>
              {console.log("searchResults", searchResults)}
              {searchResults && searchResults.length > 0 ? (
                <CommunityPostList
                  posts={searchResults}
                />
              ) : (
                <div style={{ margin: "40px 0", textAlign: "center", color: "#888" }}>
                  검색 결과가 없습니다.
                </div>
              )}
            </>
          ) : (
            <CommunityPostList sortBy={selectedSort} categoryId={selectedCategory} />
          )}

          {/* 검색 결과 페이지네이션 */}
          {searchKeyword.trim() && searchResults && searchTotalPages > 1 && (
            <div className="communitypost-pagination">
              <button
                className="communitypost-pagination-arrow"
                onClick={() => handleSearch(0)}
                disabled={searchPage === 0}
              >&#171;</button>
              <button
                className="communitypost-pagination-arrow"
                onClick={() => handleSearch(searchPage - 1)}
                disabled={searchPage === 0}
              >&#60;</button>
              {Array.from({ length: searchTotalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`communitypost-pagination-btn${searchPage === i ? " active" : ""}`}
                  onClick={() => handleSearch(i)}
                  style={searchPage === i ? { cursor: "default" } : {}}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="communitypost-pagination-arrow"
                onClick={() => handleSearch(searchPage + 1)}
                disabled={searchPage === searchTotalPages - 1}
              >&#62;</button>
              <button
                className="communitypost-pagination-arrow"
                onClick={() => handleSearch(searchTotalPages - 1)}
                disabled={searchPage === searchTotalPages - 1}
              >&#187;</button>
            </div>
          )}
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default Community;