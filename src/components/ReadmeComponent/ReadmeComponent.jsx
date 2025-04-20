import PropTypes from "prop-types";
import React from "react";
import "./ReadmeComponent.css";

export const ReadmeComponent = ({
  property1,
  className,
  divClassName,
  onClick,
}) => {
  return (
    <div
      className={`component-7 property-1-8-${property1} ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={`text-wrapper-6 ${divClassName}`}>README</div>
    </div>
  );
};

ReadmeComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default ReadmeComponent;
