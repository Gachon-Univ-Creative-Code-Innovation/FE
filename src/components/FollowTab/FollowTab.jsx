import PropTypes from "prop-types";
import React from "react";
import "./FollowTab.css";

const FollowTab = ({ type, isSelected, onClick }) => {
  const label = type === "follow" ? "Following" : "Follower";

  return (
    <div className="followtab-wrapper" onClick={onClick}>
      <span className={`followtab-label ${isSelected ? "selected" : ""}`}>
        {label}
      </span>
    </div>
  );
};

FollowTab.propTypes = {
  type: PropTypes.oneOf(["follow", "follower"]).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FollowTab;
