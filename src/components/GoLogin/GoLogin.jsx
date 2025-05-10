import PropTypes from "prop-types";
import React from "react";
import "./GoLogin.css";

export const GoLogin = ({ className, onClick }) => {
  return (
    <div className={`gologin-component ${className}`} onClick={onClick}>
      <p className="gologin-span-wrapper">
        <span className="gologin-text-wrapper">로그인 하기 ⟶</span>
      </p>
    </div>
  );
};

GoLogin.propTypes = {
  onClick: PropTypes.func,
};

export default GoLogin;
