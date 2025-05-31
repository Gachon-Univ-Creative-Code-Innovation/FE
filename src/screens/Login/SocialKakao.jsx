import React from "react";

const SocialKakao = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const kakaoURL =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <img
        src="/img/kakao_login.png"
        alt="카카오 로그인"
        style={{ height: 60, width: 260, borderRadius: 7 }}
      />
    </button>
  );
};

export default SocialKakao;
