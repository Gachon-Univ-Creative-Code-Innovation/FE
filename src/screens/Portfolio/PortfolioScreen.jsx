import React, { useState, useEffect } from "react";
import MyWorkSpace from "../../components/MyWorkSpace/MyWorkSpace";
import ExploreComponent from "../../components/ExploreComponent/ExploreComponent";
import Filter from "../../components/Filter/Filter";
import MakePortfolio from "../../components/MakePortfolio/MakePortfolio";
import Navbar2 from "../../components/Navbar2/Navbar2";
import PortfolioCardList from "../../components/PortfolioCardList/PortfolioCardList";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./PortfolioScreen.css";

const ITEMS_PER_PAGE = 12;
const PAGE_GROUP_SIZE = 5;

const dummyExploreData = [
  { name: "김송희" },
  { name: "이경준" },
  { name: "강현승" },
  { name: "문승주" },
  { name: "조선현" },
  { name: "전준배" },
  { name: "이재모" },
  { name: "김현지" },
  { name: "로이킴" },
  { name: "초코송이" },
  { name: "전준바이" },
  { name: "준페이" },
  { name: "응우옌" },
  { name: "레전드맛집" },
  { name: "전준봬" },
  { name: "전중배" },
];

const dummyMyPortfolio = [
  { name: "내 포트폴리오 A" },
  { name: "내 포트폴리오 B" },
  { name: "내 포트폴리오 C" },
];

export const PortfolioScreen = () => {
  const [exploreData, setExploreData] = useState([]);
  const [myData, setMyData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("explore");

  const [page, setPage] = useState(0);
  const [pageGroup, setPageGroup] = useState(0);

  useEffect(() => {
    setExploreData(dummyExploreData);
    setMyData(dummyMyPortfolio);
  }, []);

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

  return (
    <PageTransitionWrapper>
      <Navbar2 />
      <div className="portfolio-screen">
        <div className="portfolio-screen-view-top">
          <div className="portfolio-screen-frame-spacer" />
        </div>

        <div className="portfolio-screen-view-bottom">
          <MakePortfolio />

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

          <Filter />

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
