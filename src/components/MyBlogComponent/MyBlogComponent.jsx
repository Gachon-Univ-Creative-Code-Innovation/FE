import PropTypes from "prop-types";
import React from "react";
import "./MyBlogComponent.css";

export const MyblogComponent = ({ property1 = "default", className = "" }) => {
  return (
    <div
      className={`myblogcomponent-container myblogcomponent-${property1} ${className}`}
    >
      <div className="myblogcomponent-text">MY BLOG</div>
    </div>
  );
};

MyblogComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
  className: PropTypes.string,
};

export default MyblogComponent;
