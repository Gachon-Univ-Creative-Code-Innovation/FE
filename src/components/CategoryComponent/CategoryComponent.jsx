import PropTypes from "prop-types";
import React from "react";
import "./CategoryComponent.css";

export const CategoryComponent = ({ property1, className, divClassName }) => {
  return (
    <div className={`component-3 property-1-2-${property1} ${className}`}>
      <div className={`text-wrapper-2 ${divClassName}`}>Category</div>
    </div>
  );
};

CategoryComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
};

export default CategoryComponent;
