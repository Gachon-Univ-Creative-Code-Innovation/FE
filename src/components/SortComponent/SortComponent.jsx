import PropTypes from "prop-types";
import React from "react";
import "./SortComponent.css";
import SortIcon from "../../icons/SortIcon/SortIcon";

export const SortComponent = ({ className, isActive }) => {
  return (
    <button
      className={`sortcomponent-btn ${className} ${isActive ? "active" : ""}`}
    >
      <div className="sortcomponent-text">정렬</div>
      <SortIcon className="sortcomponent-icon" strokeWidth={2} />
    </button>
  );
};

SortComponent.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
};

export default SortComponent;
