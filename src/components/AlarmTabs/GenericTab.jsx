import PropTypes from "prop-types";
import React from "react";
import "./GenericTab.css";

const GenericTab = ({ label, isSelected, onClick }) => {
  return (
    <div
      className={`generic-tab${isSelected ? " selected" : ""}`}
      onClick={onClick}
    >
      <div className="tab-label">{label}</div>
    </div>
  );
};

GenericTab.propTypes = {
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GenericTab;
