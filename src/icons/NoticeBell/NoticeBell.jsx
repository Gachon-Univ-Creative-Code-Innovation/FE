import React from "react";
import { useNavigate } from "react-router-dom"; // 라우팅 기능 사용

export const NoticeBell = ({ className = "", style = {} }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleClick = () => {
    navigate("/notice"); // 아이콘 클릭 시 /notice 페이지로 이동
  };

  return (
    <svg
      className={className}
      style={{ ...style, cursor: "pointer" }} // 클릭 가능 표시
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
    >
      <path
        d="M7.33333 21.8889V21.8889C9.7241 22.6134 12.2759 22.6134 14.6667 21.8889V21.8889M9.87108 1.09471V1.09471C6.33183 1.51605 3.66667 4.51732 3.66667 8.08156V10.2247C3.66667 10.2966 3.65435 10.368 3.63026 10.4357L1.94934 15.1633C1.4864 16.4653 2.4519 17.8333 3.83377 17.8333H18.1662C19.5481 17.8333 20.5136 16.4653 20.0507 15.1633L18.3694 10.4347C18.3455 10.3676 18.3333 10.297 18.3333 10.2258V8.67663C18.3333 4.78312 15.3409 1.50807 11.4702 1.08734V1.08734C10.9409 1.02981 10.3998 1.03177 9.87108 1.09471Z"
        stroke="#1d1652"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NoticeBell;
