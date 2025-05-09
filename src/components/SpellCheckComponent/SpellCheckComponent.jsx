import PropTypes from "prop-types";
import React, { useState } from "react";
import "./SpellCheckComponent.css";

export const SpellCheckComponent = ({ className }) => {
  const [hoverState, setHoverState] = useState("default"); // ✅ 기본 상태 설정

  return (
    <div
      className={`spell-check-component ${hoverState} ${className}`}
      onMouseEnter={() => setHoverState("hover")} // ✅ 마우스를 올리면 hover 클래스 추가
      onMouseLeave={() => setHoverState("default")} // ✅ 마우스를 떼면 default로 변경
    >
      <div className="text-wrapper">맞춤법 검사</div>

      <div className="group">
        <div className="overlap-group">
          <div className="div">→</div>
        </div>
      </div>
    </div>
  );
};

SpellCheckComponent.propTypes = {
  className: PropTypes.func,
};
