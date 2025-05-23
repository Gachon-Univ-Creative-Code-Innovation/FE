import PropTypes from "prop-types";
import React from "react";
import FilterIcon from "../../icons/FilterIcon/FilterIcon";

export const FilterComponent = ({
  className,
  vectorClassName,
  isActive,
  activeColor = "#1D1652",
  inactiveColor = "#A3B3BF",
}) => {
  const color = isActive ? activeColor : inactiveColor;

  return (
    <button
      className={`filtercomponent-btn ${className}`}
      style={{
        border: isActive ? `1px solid ${activeColor}` : "1px solid transparent",
        borderRadius: "8px",
        padding: "4px 8px",
        transition: "border-color 0.3s, color 0.3s",
        background: "transparent",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        boxSizing: "border-box",
        minWidth: "90px",
      }}
    >
      <div
        className="filtercomponent-text"
        style={{
          color,
          fontFamily: "Inter, Helvetica",
          fontSize: "15px",
          fontWeight: 400,
          lineHeight: "30px",
          textAlign: "center",
          whiteSpace: "nowrap",
          transition: "color 0.3s ease",
        }}
      >
        필터
      </div>
      <FilterIcon
        className={`filtercomponent-icon ${vectorClassName}`}
        strokeColor={color}
      />
    </button>
  );
};

FilterComponent.propTypes = {
  className: PropTypes.string,
  vectorClassName: PropTypes.string,
  isActive: PropTypes.bool,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
};

export default FilterComponent;
