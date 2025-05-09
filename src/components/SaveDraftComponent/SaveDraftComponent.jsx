import PropTypes from "prop-types";
import React, { useState } from "react";
import "./SaveDraftComponent.css";

export const SaveDraftComponent = ({ property1, onClick }) => {
  const [buttonState, setButtonState] = useState("default"); // ✅ 기본 상태 설정

  return (
    <button
      className={`save-draft-component ${buttonState}`}
      onMouseDown={() => setButtonState("click")} // ✅ 마우스 누를 때 "click" 상태 적용
      onMouseUp={() => setButtonState("default")} // ✅ 마우스 떼면 "default"로 복귀
      onClick={onClick} // ✅ 기존 클릭 이벤트 실행
    >
      <div className="text-wrapper">임시 저장</div>
    </button>
  );
};

SaveDraftComponent.propTypes = {
  property1: PropTypes.oneOf(["click", "default"]),
  onClick: PropTypes.func,
};
