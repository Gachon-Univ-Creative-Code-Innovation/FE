import PropTypes from "prop-types";
import React from "react";
import "./MypageComponent.css";

export const MypageComponent = ({
  property1 = "default",
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`mypagecomponent-container mypagecomponent-${property1} ${className}`}
      onClick={onClick}
    >
      <div className="mypagecomponent-text">MY PAGE</div>
    </div>
  );
};

MypageComponent.propTypes = {
  property1: PropTypes.oneOf(["default", "hover"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default MypageComponent;
