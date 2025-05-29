import PropTypes from "prop-types";
import React from "react";
import "./CommunityTabTool.css";

export const CommunityTabTool = ({
  property1,
  className,
  divClassName,
  text = "게시판",
  onClick,
}) => {
  return (
    <div
      className={`communitytab-wrapper ${property1} ${className || ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={`communitytab-text ${divClassName || ""}`}>{text}</div>
    </div>
  );
};

CommunityTabTool.propTypes = {
  property1: PropTypes.oneOf(["hover", "default", "active"]),
  text: PropTypes.string,
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default CommunityTabTool;
