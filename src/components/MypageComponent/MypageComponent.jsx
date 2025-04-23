import PropTypes from "prop-types";
import React from "react";
import "./MypageComponent.css";

export const MypageComponent = ({ property1 }) => {
  return (
    <div className="mypage">
      <div className="text-wrapper">MY PAGE</div>
    </div>
  );
};

MypageComponent.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default MypageComponent;
