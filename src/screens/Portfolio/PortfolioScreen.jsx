import React, { useState, useEffect } from "react";
import MyWorkSpace from "../../components/MyWorkSpace/MyWorkSpace";
import ExploreComponent from "../../components/ExploreComponent/ExploreComponent";
import Filter from "../../components/Filter/Filter";
import MakePortfolio from "../../components/MakePortfolio/MakePortfolio";
import Navbar2 from "../../components/Navbar2/Navbar2";
import PortfolioCardList from "../../components/PortfolioCardList/PortfolioCardList";
import "./PortfolioScreen.css";

const ITEMS_PER_PAGE = 12;
const PAGE_GROUP_SIZE = 5;

const dummyData = [
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

export const PortfolioScreen = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageGroup, setPageGroup] = useState(0);

  // 나중에 백엔드 연동 시 fetch → setData(json)으로 교체
  useEffect(() => {
    setData(dummyData);
  }, []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startPage = pageGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);
  const canPrevGroup = pageGroup > 0;
  const canNextGroup = endPage < totalPages;

  return (
    <div className="portfolio-screen">
      <div className="portfolio-screen-view-top">
        <Navbar2 className="portfolio-screen-navbar" />
        <div className="portfolio-screen-frame-spacer" />
      </div>

      <div className="portfolio-screen-view-bottom">
        <MakePortfolio />
        <div className="portfolio-screen-category">
          <MyWorkSpace
            className="portfolio-screen-component-1"
            property1="default"
          />
          <ExploreComponent
            className="portfolio-screen-component-2"
            property1="hover"
          />
        </div>

        <Filter />

        <PortfolioCardList
          data={data}
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
  );
};

export default PortfolioScreen;
