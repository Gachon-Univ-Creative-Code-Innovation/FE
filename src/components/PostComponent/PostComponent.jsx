import PropTypes from "prop-types";
import React, { useState } from "react";
import "./PostComponent.css";

export const PostComponent = ({ property1, onClick, text }) => {
  const [buttonState, setButtonState] = useState("default"); // ✅ 기본 상태 설정

  return (
    <button
      className={`post-component ${buttonState}`}
      onMouseDown={() => setButtonState("click")} // ✅ 마우스 누를 때 "click" 상태 적용
      onMouseUp={() => setButtonState("default")} // ✅ 마우스 떼면 "default"로 복귀
      onClick={onClick} // ✅ 기존 클릭 이벤트 실행
    >
      <div className="text-wrapper">{text}</div>
    </button>
  );
};

PostComponent.propTypes = {
  property1: PropTypes.oneOf(["click", "default"]),
  onClick: PropTypes.func,
};
