import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./LoginRequiredPopup.css";
import LoginComponent from "../../components/LoginComponent/LoginComponent";

const MDiv = motion.div;

const LoginRequiredPopup = ({ onClose }) => {
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
        <div className="login-required-popup__title">Login Required</div>

        <div className="login-required-popup__description-wrapper">
          <p className="login-required-popup__description">
            이 기능은 로그인 후 이용 가능합니다.
            <br />
            로그인으로 나만의 여정을 지금 바로 이어가 보세요.
          </p>
        </div>

        <div className="login-required-popup__button-group">
          <div className="login-required-popup__button" onClick={onClose}>
            <LoginComponent className="component-1" property1="default" />
          </div>
        </div>
      </MDiv>
    </MDiv>
  );
};

export default LoginRequiredPopup;
