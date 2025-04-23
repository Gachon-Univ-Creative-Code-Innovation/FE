import React from "react";

const MypageUserIcon = ({ className = "", style = {} }) => {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M15.5 19C15.5 15.134 12.1421 12 8 12C3.85786 12 0.5 15.134 0.5 19M8 9C5.63307 9 3.71429 7.20914 3.71429 5C3.71429 2.79086 5.63307 1 8 1C10.3669 1 12.2857 2.79086 12.2857 5C12.2857 7.20914 10.3669 9 8 9Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MypageUserIcon;
