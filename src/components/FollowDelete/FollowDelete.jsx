import PropTypes from "prop-types";
import React from "react";
import "./FollowDelete.css";

export const FollowDelete = ({ className, tabType, onDelete }) => {
  const buttonText = tabType === "follower" ? "삭제" : "팔로우취소";

  return (
    <div className={`follow-delete-wrapper ${className}`} onClick={onDelete}>
      <div className="follow-delete-text">{buttonText}</div>
    </div>
  );
};

FollowDelete.propTypes = {
  className: PropTypes.string,
  tabType: PropTypes.oneOf(["follow", "follower"]).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FollowDelete;
