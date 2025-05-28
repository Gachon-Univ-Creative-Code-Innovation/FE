import PropTypes from "prop-types";
import React from "react";
import "./ReadmeComponent.css";

export const ReadmeComponent = ({
  property1 = "default",
  className,
  divClassName,
  onClick,
}) => {
  const finalTextClass = divClassName?.includes("readmecomponent-text")
    ? divClassName
    : `readmecomponent-text ${divClassName || ""}`;

  return (
    <div
      className={`readmecomponent-container readmecomponent-${property1} ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={finalTextClass}>README</div>
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
