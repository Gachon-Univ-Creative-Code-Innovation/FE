import React from "react";
import PropTypes from "prop-types";
import "./FollowButton.css";

const FollowButton = ({
  onClick,
  className = "",
  disabled = false,
  isFollowing,
}) => {
  return (
    <button
      className={`follow-btn-component ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

FollowButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isFollowing: PropTypes.bool.isRequired,
};

export default FollowButton;
