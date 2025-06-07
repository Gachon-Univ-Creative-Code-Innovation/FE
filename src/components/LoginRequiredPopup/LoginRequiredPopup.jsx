import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WarningIcon from "../../icons/WarningIcon/WarningIcon";
import "./LoginRequiredPopup.css";

const MDiv = motion.div;

const LoginRequiredPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate("/login");
  };

  return (
    <MDiv
      className="login-required-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MDiv
        className="login-required-popup__container"
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* 로그인 아이콘 */}
        <div className="login-required-popup__icon">
          <WarningIcon />
        </div>

        <div className="login-required-popup__content">
          <div className="login-required-popup__title">로그인이 필요합니다</div>
          <p className="login-required-popup__description">
            이 기능을 사용하려면 로그인이 필요합니다.
            <br />
            로그인 후 다시 시도해 주세요.
          </p>
        </div>

        <div className="login-required-popup__button-group">
          <button className="login-required-popup__button secondary" onClick={onClose}>
            <span className="login-required-popup__button-text">확인</span>
          </button>

          <button className="login-required-popup__button primary" onClick={handleLoginClick}>
            <span className="login-required-popup__button-text">로그인</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="login-required-popup__button-icon"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </MDiv>
    </MDiv>
  );
};

export default LoginRequiredPopup;
