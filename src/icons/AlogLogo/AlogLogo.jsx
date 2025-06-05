import React from "react";

const AlogLogo = ({
  width = 200,
  height = 80,
  className = "",
  ...rest // 나머지 props를 모두 받음 (예: onClick, style 등)
}) => {
  return (
    <img
      src="/img/Alog_logo.png"
      alt="Alog Logo"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "contain" }}
      {...rest} /* onClick, style, role 등 전달 */
    />
  );
};

export default AlogLogo;
