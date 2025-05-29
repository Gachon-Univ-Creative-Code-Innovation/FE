// Filter.jsx
import React, { useState, useEffect, useRef } from "react";
import FilterComponent from "../FilterComponent/FilterComponent";
import SortComponent from "../SortComponent/SortComponent";
import FilterScreen from "../FilterScreen/FilterScreen";
import SortScreen from "../SortScreen/SortScreen";
import "./Filter.css";

export const Filter = () => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterClosing, setFilterClosing] = useState(false);
  const [filterVisibleClass, setFilterVisibleClass] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  const [selectedSort, setSelectedSort] = useState("");
  const [showSortPopup, setShowSortPopup] = useState(false);
  const sortBtnRef = useRef(null);

  const openFilter = () => {
    setShowFilterPopup(true);
    setFilterClosing(false);
  };
  const closeFilter = () => {
    setFilterVisibleClass("");
    setFilterClosing(true);
    setTimeout(() => {
      setShowFilterPopup(false);
      setFilterClosing(false);
    }, 200);
  };
  const saveFilters = (f) => {
    setSelectedFilters(f);
    closeFilter();
  };
  useEffect(() => {
    if (showFilterPopup) {
      requestAnimationFrame(() => {
        setFilterVisibleClass("filtersection-overlay-visible");
      });
    }
  }, [showFilterPopup]);
  const isFilterActive = Object.keys(selectedFilters).some(
    (k) => selectedFilters[k].length > 0
  );

  const toggleSort = () => setShowSortPopup((v) => !v);
  useEffect(() => {
    const handler = (e) => {
      if (sortBtnRef.current && !sortBtnRef.current.contains(e.target)) {
        setShowSortPopup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="filtersection-wrapper">
        <div
          className={`filtersection-btn-wrapper ${
            isFilterActive ? "filtersection-btn-active" : ""
          }`}
          onClick={openFilter}
        >
          <FilterComponent
            className="filtersection-btn"
            property1="default"
            isActive={isFilterActive}
          />
        </div>

        <div
          className={`sortsection-btn-wrapper ${
            selectedSort ? "sortsection-btn-active" : ""
          }`}
          ref={sortBtnRef}
          onClick={toggleSort}
        >
          <SortComponent
            className="filtersection-btn"
            property1="default"
            isActive={!!selectedSort}
          />
          {showSortPopup && (
            <div className="sortsection-dropdown">
              <SortScreen
                selected={selectedSort}
                onSelectSort={(opt) => {
                  setSelectedSort(opt);
                  setShowSortPopup(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showFilterPopup && (
        <div
          className={`filtersection-overlay ${
            filterClosing ? "filtersection-overlay-closing" : filterVisibleClass
          }`}
          onClick={closeFilter}
        >
          <div
            className="filtersection-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterScreen onClose={closeFilter} onSave={saveFilters} />
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;
