import React from "react";
import "./Component19.css";

export const Component19 = ({ className = "" }) => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <svg
      className={`component-19 ${className}`}
      fill="none"
      height="11"
      viewBox="0 0 15 11"
      width="15"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleScrollTop}
      style={{ cursor: "pointer" }}
    >
      <path
        className="path"
        d="M1 10L7.5 1L14 10"
        stroke="#1d1652"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Component19;
