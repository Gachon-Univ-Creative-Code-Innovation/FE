import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButtonComponent.css";

export const LogoutComponent = ({ className, divClassName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 인증 정보 삭제
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    // 메인 페이지로 이동
    window.location.href = "/MainPageBefore";
  };

  return (
    <div className={`logout-component ${className}`} onClick={handleLogout}>
      <div className={`text-wrapper ${divClassName}`}>로그아웃</div>
    </div>
  );
};

LogoutComponent.propTypes = {
  className: PropTypes.string,
  divClassName: PropTypes.string,
};

export default LogoutComponent;
