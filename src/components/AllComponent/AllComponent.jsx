import PropTypes from "prop-types";
import React from "react";
import "./AllComponent.css";

export const AllComponent = ({
  property1,
  className,
  divClassName,
  onClick,
}) => {
  const finalTextClass = divClassName?.includes("allcomponent-text")
    ? divClassName
    : `allcomponent-text ${divClassName || ""}`;

  return (
    <div
      className={`allcomponent allcomponent-${property1} ${className}`}
      onClick={onClick}
    >
      <div className={finalTextClass}>All</div>
    </div>
  );
};

AllComponent.propTypes = {
  property1: PropTypes.oneOf(["hover", "default"]),
  className: PropTypes.string,
  divClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default AllComponent;
