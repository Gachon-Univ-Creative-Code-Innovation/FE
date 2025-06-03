import React from "react";
import PropTypes from "prop-types";
import "./FollowButton.css";

const FollowButton = ({ onClick, className = "", disabled = false }) => {
  return (
    <button
      className={`follow-btn-component ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      Follow
    </button>
  );
};

FollowButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default FollowButton;
