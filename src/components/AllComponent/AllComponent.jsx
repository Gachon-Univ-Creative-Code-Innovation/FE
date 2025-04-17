import PropTypes from "prop-types";
import React from "react";
import "./AllComponent.css"; // ✅ 동일한 스타일 사용

export const AllComponent = ({
  property1 = "default",
  className = "",
  divClassName = "",
}) => {
  return (
    <div className={`component-5 property-1-6-${property1} ${className}`}>
      <div className={`text-wrapper-4 ${divClassName}`}>All</div>
    </div>
  );
};

AllComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
};

export default AllComponent;
