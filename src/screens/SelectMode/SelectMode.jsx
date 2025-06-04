import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Component22 from "../../components/SelectOKComponent/SelectOKComponent";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import "./SelectMode.css";

const MotionDiv = motion.div;

const SelectMode = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("selectmode-overlay")) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="selectmode-overlay" onClick={handleOverlayClick}>
          <MotionDiv
            className="selectmode-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <button className="selectmode-close" onClick={onClose}>
              <CloseIcon />
            </button>

            <div className="select-mode-wrapper">
              <div className="div-6">
                <p className="selectmode-role-text">
                  <span className="selectmode-bold">Sign up for Alog</span>
                  <br />
                  <br />
                  <br />
                  이메일 인증을 통해 안전하게 계정을 만들어 보세요.
                  <br />
                  가입을 완료하면 서비스 이용을 위한 개인정보 수집 및 이용에 동의하게 됩니다.
                </p>

                <div className="selectmode-button-wrapper">
                  <Component22
                    className="selectmode-button"
                    property1="frame-38"
                    to="/signup"
                  />
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SelectMode;