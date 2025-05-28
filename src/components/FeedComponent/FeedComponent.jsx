import PropTypes from "prop-types";
import React from "react";
import "./FeedComponent.css";

export const FeedComponent = ({
  property1,
  className,
  divClassName,
  onClick,
}) => {
  const finalTextClass = divClassName?.includes("feedcomponent-text")
    ? divClassName
    : `feedcomponent-text ${divClassName || ""}`;

  return (
    <div
      className={`feedcomponent feedcomponent-${property1} ${className}`}
      onClick={onClick}
    >
      <div className={finalTextClass}>Feed</div>
    </div>
  );
};

FeedComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default FeedComponent;
