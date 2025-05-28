import React from "react";
import { useNavigate } from "react-router-dom";

export const GoBackIcon = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <svg
      className={`component-18 ${className}`}
      fill="none"
      height="34"
      viewBox="0 0 24 34"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <path
        className="path"
        d="M16.5 10.5L7.5 17L16.5 23.5"
        stroke="#1d1652"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default GoBackIcon;
