import PropTypes from "prop-types";
import React, { useState } from "react";
import "./PublishComponent.css";

export const PublishComponent = ({ className, onClick }) => {
  const [hoverState, setHoverState] = useState("default"); // ✅ 기본 상태 설정

  return (
    <div
      className={`publish-component ${hoverState} ${className}`}
      onMouseEnter={() => setHoverState("hover")} // ✅ 마우스를 올리면 hover 클래스 추가
      onMouseLeave={() => setHoverState("default")} // ✅ 마우스를 떼면 default로 변경
      onClick={onClick} // ✅ 클릭 이벤트 실행
    >
      <div className="text-wrapper">발행하기</div>

      <div className="group">
        <div className="overlap-group">
          <div className="div">→</div>
        </div>
      </div>
    </div>
  );
};

PublishComponent.propTypes = {
  className: PropTypes.string, // ✅ PropTypes 수정: className은 문자열로 설정
  onClick: PropTypes.func, // ✅ onClick을 함수로 받도록 설정
};
