import PropTypes from "prop-types";
import React from "react";
import "./CommunityComponent.css";

export const CommunityComponent = ({ className, onClick }) => {
  return (
    <div
      className={`community ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }} // 포인터 추가
    >
      <div className="text-wrapper-2">COMMUNITY</div>
    </div>
  );
};

CommunityComponent.propTypes = {
  property1: PropTypes.oneOf(["default"]),
  onClick: PropTypes.func, // 추가
};

export default CommunityComponent;
