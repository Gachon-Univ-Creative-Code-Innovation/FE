import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SocialGoogle = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const scope = encodeURIComponent("openid profile email");
  const responseType = "code";

  const handleRedirectLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${responseType}` +
      `&scope=${scope}` +
      `&prompt=select_account`;

    window.location.href = authUrl;
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <button
        type="button"
        onClick={handleRedirectLogin}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <img
          src="/img/Google_login.png"
          alt="Google 로그인"
          style={{ height: 60, width: 260, borderRadius: 6 }}
        />
      </button>
    </GoogleOAuthProvider>
  );
};

export default SocialGoogle;
