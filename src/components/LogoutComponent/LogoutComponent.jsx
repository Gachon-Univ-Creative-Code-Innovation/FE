import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutComponent.css";

export const LogoutComponent = ({ className, divClassName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    //예시: localStorage의 로그인 정보 제거
    //localStorage.removeItem("isLoggedIn");
    //localStorage.removeItem("user");

    // ✅ 메인 페이지로 이동
    navigate("/MainPageBefore");
  };

  return (
    <div className={`logout-component ${className}`} onClick={handleLogout}>
      <div className={`text-wrapper ${divClassName}`}>Logout</div>
    </div>
  );
};

LogoutComponent.propTypes = {
  className: PropTypes.string,
  divClassName: PropTypes.string,
};

export default LogoutComponent;
