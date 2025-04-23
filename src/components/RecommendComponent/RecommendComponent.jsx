import PropTypes from "prop-types";
import React from "react";
import "./RecommendComponent.css";

export const RecommendComponent = ({
  property1,
  className,
  divClassName,
  onClick,
}) => {
  const finalTextClass = divClassName?.includes("recommendcomponent-text")
    ? divClassName
    : `recommendcomponent-text ${divClassName || ""}`;

  return (
    <div
      className={`recommendcomponent recommendcomponent-${property1} ${className}`}
      onClick={onClick}
    >
      <div className={finalTextClass}>Recommend</div>
    </div>
  );
};

RecommendComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default RecommendComponent;
