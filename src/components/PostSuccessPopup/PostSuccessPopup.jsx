import React from "react";
import { motion } from "framer-motion";
import SuccessIcon from "../../icons/SuccessIcon/SuccessIcon";
import "./PostSuccessPopup.css";

const MDiv = motion.div;

const PostSuccessPopup = ({ onConfirm, message = "게시되었습니다!" }) => {
  return (
    <MDiv
      className="post-success-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MDiv
        className="post-success-popup__container"
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* 성공 아이콘 */}
        <div className="post-success-popup__icon">
          <SuccessIcon />
        </div>

        <div className="post-success-popup__content">
          <div className="post-success-popup__title">{message}</div>
          <p className="post-success-popup__description">
            작성하신 글이 성공적으로 게시되었습니다.
            <br />
            확인을 누르면 작성한 글을 보실 수 있습니다.
          </p>
        </div>

        <button className="post-success-popup__button" onClick={onConfirm}>
          <span className="post-success-popup__button-text">확인</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="post-success-popup__button-icon"
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
      </MDiv>
    </MDiv>
  );
};

export default PostSuccessPopup; 