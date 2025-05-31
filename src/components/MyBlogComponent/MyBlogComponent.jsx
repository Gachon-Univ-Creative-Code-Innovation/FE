import PropTypes from "prop-types";
import React from "react";
import "./MyBlogComponent.css";

export const MyBlogComponent = ({
  property1 = "default",
  className = "",
  onClick,
}) => {
  // property1 값에 따라 두 쪽의 스타일을 모두 적용
  const containerClass = [
    "myblogcomponent-container",
    `myblogcomponent-${property1}`,
    "property-frame-wrapper",
    property1,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass} onClick={onClick}>
      <div className="myblogcomponent-text text-wrapper-5">MY BLOG</div>
    </div>
  );
};

MyBlogComponent.propTypes = {
  property1: PropTypes.string, // ["default", "hover", "frame-117", "frame-118"] 등 모두 허용
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default MyBlogComponent;