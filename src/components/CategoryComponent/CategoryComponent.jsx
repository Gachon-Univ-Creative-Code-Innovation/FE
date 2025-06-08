import PropTypes from "prop-types";
import React from "react";
import "./CategoryComponent.css";

export const CategoryComponent = ({
  property1,
  className,
  divClassName,
  onClick,
}) => {
  const finalTextClass = divClassName?.includes("categorycomponent-text")
    ? divClassName
    : `categorycomponent-text ${divClassName || ""}`;

  return (
    <div
      className={`categorycomponent categorycomponent-${property1} ${className}`}
      onClick={onClick}
    >
      <div className={finalTextClass}>카테고리</div>
    </div>
  );
};

CategoryComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default CategoryComponent;
