import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutComponent.css";

export const LogoutComponent = ({ property1 = "default", text = "LOGOUT" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (text === "LOGOUT") {
      // 로그인 정보 삭제
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");

      // 로그아웃 후 메인 페이지 이동
      navigate("/MainPageBefore");
    } else if (text === "LOGIN") {
      // 로그인 페이지로 이동
      navigate("/login");
    }
  };

  return (
    <div className={`logout logout-${property1}`} onClick={handleClick}>
      <div className="logout-text">{text}</div>
    </div>
  );
};

LogoutComponent.propTypes = {
  property1: PropTypes.oneOf(["default"]),
  text: PropTypes.string,
};

export default LogoutComponent;
