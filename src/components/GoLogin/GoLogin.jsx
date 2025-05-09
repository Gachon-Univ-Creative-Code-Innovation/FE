import PropTypes from "prop-types";
import React from "react";
import "./GoLogin.css";

export const GoLogin = ({ property1, className, onClick }) => {
  return (
    <div className={`gologin-component ${className}`} onClick={onClick}>
      <p className="gologin-span-wrapper">
        <span className="gologin-text-wrapper">로그인 하기 ⟶</span>
      </p>
    </div>
  );
};

GoLogin.propTypes = {
  property1: PropTypes.oneOf(["default"]),
  onClick: PropTypes.func, // 추가
};

export default GoLogin;
