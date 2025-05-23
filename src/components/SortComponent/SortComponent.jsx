import PropTypes from "prop-types";
import React from "react";
import "./SortComponent.css";
import SortIcon from "../../icons/SortIcon/SortIcon";

export const SortComponent = ({ className, vectorClassName, isActive }) => {
  const color = isActive ? "#1D1652" : "#A3B3BF";

  return (
    <button
      className={`sortcomponent-btn ${className}`}
      style={{
        border: isActive ? "1px solid #1D1652" : "1px solid transparent",
        borderRadius: "8px",
        padding: "4px 8px",
        transition: "border-color 0.3s, color 0.3s",
        background: "transparent",
      }}
    >
      <div
        className="sortcomponent-text"
        style={{ color, transition: "color 0.3s ease" }}
      >
        정렬
      </div>
      <SortIcon
        className={`sortcomponent-icon ${vectorClassName}`}
        strokeColor={color}
      />
    </button>
  );
};

SortComponent.propTypes = {
  className: PropTypes.string,
  vectorClassName: PropTypes.string,
  isActive: PropTypes.bool,
};

export default SortComponent;
