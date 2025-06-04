import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyWorkSpace from "../../components/MyWorkSpace/MyWorkSpace";
import ExploreComponent from "../../components/ExploreComponent/ExploreComponent";
import Filter from "../../components/Filter/Filter";
import MakePortfolio from "../../components/MakePortfolio/MakePortfolio";
import Navbar2 from "../../components/Navbar2/Navbar2";
import PortfolioCardList from "../../components/PortfolioCardList/PortfolioCardList";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./PortfolioScreen.css";
import api from "../../api/local-instance";

const ITEMS_PER_PAGE = 12;
const PAGE_GROUP_SIZE = 5;

export const PortfolioScreen = () => {
  const navigate = useNavigate();
  const [exploreData, setExploreData] = useState([]);
  const [myData, setMyData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("explore");
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [page, setPage] = useState(0);
  const [pageGroup, setPageGroup] = useState(0);

  const getSortParams = () => {
    if (selectedSort === "최신순") return { isDesc: true };
    if (selectedSort === "오래된 순") return { isDesc: false };
    if (selectedSort === "추천순") return { sort: "recommend" };
    return { isDesc: true };
  };

  // 정렬 옵션이 바뀔 때마다 데이터 다시 불러오기
  useEffect(() => {
    const params = getSortParams();
      
    const fetchExplorePortfolio = async () => {
      try {
        const url = new URL("http://localhost:8080/api/portfolio/all");
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
        const res = await api.get(url.toString(), {
          headers: { Accept: "application/json" }
        });
        if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
          // 이미지가 빈 문자열이면 기본 이미지로 대체
          const replaced = res.data.data.map(item => ({
            ...item,
            image: item.image === "" ? "https://marketplace.canva.com/EAFxweoG8ww/1/0/1131w/canva-black-and-white-simple-geometric-content-creator-student-portfolio-KydeMOdt6B0.jpg" : item.image
          }));
          setExploreData(replaced);
        } else {
          setExploreData([]);
        }
      } catch (err) {
        setExploreData([]);
        console.error("포트폴리오 전체 리스트 불러오기 실패:", err);
      }
    };
    fetchExplorePortfolio();

    const fetchMyPortfolio = async () => {
      try {
        const url = new URL("http://localhost:8080/api/portfolio/list");
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
        const res = await api.get(url.toString(), {
          headers: { Accept: "application/json" }
        });
        if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
          // 이미지가 빈 문자열이면 기본 이미지로 대체
          const replaced = res.data.data.map(item => ({
            ...item,
            image: item.image === "" ? "https://marketplace.canva.com/EAFxweoG8ww/1/0/1131w/canva-black-and-white-simple-geometric-content-creator-student-portfolio-KydeMOdt6B0.jpg" : item.image
          }));
          setMyData(replaced);
        } else {
          setMyData([]);
        }
      } catch (err) {
        setMyData([]);
        console.error("포트폴리오 리스트 불러오기 실패:", err);
      }
    };
    fetchMyPortfolio();
  }, [selectedSort]);

  const currentData = selectedTab === "workspace" ? myData : exploreData;

  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const startPage = pageGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);
  const canPrevGroup = pageGroup > 0;
  const canNextGroup = endPage < totalPages;

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setPage(0);
    setPageGroup(0);
  };

  const handleMakePortfolioClick = () => {
    navigate("/portfolio/write");
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />
      <div className="portfolio-screen">
        <div className="portfolio-screen-view-top">
          <div className="portfolio-screen-frame-spacer" />
        </div>
        <div className="portfolio-screen-view-bottom">
          <MakePortfolio onClick={handleMakePortfolioClick} />
          <div className="portfolio-screen-category">
            <MyWorkSpace
              className="portfolio-screen-component-1"
              isActive={selectedTab === "workspace"}
              onClick={() => handleTabChange("workspace")}
            />
            <ExploreComponent
              className="portfolio-screen-component-2"
              isActive={selectedTab === "explore"}
              onClick={() => handleTabChange("explore")}
            />
          </div>
          <Filter selectedSort={selectedSort} onSortChange={setSelectedSort} />
          <PortfolioCardList
            data={currentData}
            page={page}
            itemsPerPage={ITEMS_PER_PAGE}
          />
          <div className="portfolio-pagination">
            <button
              className="portfolio-pagination-arrow"
              disabled={page === 0}
              onClick={() => {
                if (page === startPage && canPrevGroup) {
                  setPageGroup(pageGroup - 1);
                  setPage(
                    (pageGroup - 1) * PAGE_GROUP_SIZE + PAGE_GROUP_SIZE - 1
                  );
                } else {
                  setPage(page - 1);
                }
              }}
            >
              &#60;
            </button>

            {Array.from({ length: endPage - startPage }).map((_, idx) => (
              <button
                key={startPage + idx}
                className={`portfolio-pagination-btn${
                  page === startPage + idx ? " active" : ""
                }`}
                onClick={() => setPage(startPage + idx)}
              >
                {startPage + idx + 1}
              </button>
            ))}

            <button
              className="portfolio-pagination-arrow"
              disabled={page === totalPages - 1}
              onClick={() => {
                if (page === endPage - 1 && canNextGroup) {
                  setPageGroup(pageGroup + 1);
                  setPage((pageGroup + 1) * PAGE_GROUP_SIZE);
                } else {
                  setPage(page + 1);
                }
              }}
            >
              &#62;
            </button>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default PortfolioScreen;