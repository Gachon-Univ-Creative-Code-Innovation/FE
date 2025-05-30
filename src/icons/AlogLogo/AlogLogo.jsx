import React from "react";

const AlogLogo = ({ width = 200, height = 80, className = "" }) => {
  return (
    <img
      src="/img/Alog_logo.png" // public 폴더 기준 경로
      alt="Alog Logo"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
};

export default AlogLogo;
