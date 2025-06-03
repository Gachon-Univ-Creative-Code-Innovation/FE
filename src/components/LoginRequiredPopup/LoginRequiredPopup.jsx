import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./LoginRequiredPopup.css";
import LoginComponent from "../../components/LoginComponent/LoginComponent";

const MDiv = motion.div;

const LoginRequiredPopup = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <MDiv
      className="login-required-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MDiv
        className="login-required-popup__container"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="login-required-popup__title">로그인이 필요합니다</div>

        <div className="login-required-popup__description-wrapper">
          <p className="login-required-popup__description">
            이 기능을 사용하려면 로그인이 필요합니다.
            <br />
            로그인 후 다시 시도해 주세요.
          </p>
        </div>

        <div className="login-required-popup__button-group">
          <div className="login-required-popup__button" onClick={onClose}>
            <div className="login-required-popup__button-text">확인</div>
          </div>

          <div
            className="login-required-popup__button"
            onClick={() => navigate("/login")}
          >
            <div className="login-required-popup__button-text">로그인</div>
          </div>
        </div>
      </MDiv>
    </MDiv>
  );
};

export default LoginRequiredPopup;
