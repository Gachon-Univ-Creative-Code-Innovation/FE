import PropTypes from "prop-types";
import React from "react";
import "./HotComponent.css";

export const HotComponent = ({
  property1,
  className,
  divClassName,
  onClick,
}) => {
  const finalTextClass = divClassName?.includes("hotcomponent-text")
    ? divClassName
    : `hotcomponent-text ${divClassName || ""}`;

  return (
    <div
      className={`hotcomponent hotcomponent-${property1} ${className}`}
      onClick={onClick}
    >
      <div className={finalTextClass}>인기글</div>
    </div>
  );
};

HotComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default HotComponent;
