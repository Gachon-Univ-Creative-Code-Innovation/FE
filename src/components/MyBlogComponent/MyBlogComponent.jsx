import PropTypes from "prop-types";
import React from "react";
import "./MyBlogComponent.css";

export const MyBlogComponent = ({ property1 }) => {
  return (
    <div className={`property-frame-wrapper ${property1}`}>
      <div className="text-wrapper-5">MY BLOG</div>
    </div>
  );
};

MyBlogComponent.propTypes = {
  property1: PropTypes.oneOf(["frame-117", "frame-118"]),
};

export default MyBlogComponent;
