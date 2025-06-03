// src/components/FilterComponent/FilterComponent.jsx

import PropTypes from "prop-types";
import React from "react";
import FilterIcon from "../../icons/FilterIcon/FilterIcon";
import "./FilterComponent.css";

export const FilterComponent = ({ className, isActive }) => {
  return (
    <button
      className={`filtercomponent-btn ${className} ${isActive ? "active" : ""}`}
    >
      <div className="filtercomponent-text">필터</div>
      <FilterIcon className="filtercomponent-icon" />
    </button>
  );
};

FilterComponent.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
};

export default FilterComponent;
