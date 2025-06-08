import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/instance";
import { useWebSocket } from "../../contexts/WebSocketContext";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const { connectWebSocket } = useWebSocket();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      navigate("/login");
      return;
    }

    api
      .post("/user-service/kakao/login", { code })
      .then(({ data }) => {
        localStorage.setItem("userId", data.data.userId);
        localStorage.setItem("jwtToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        connectWebSocket(data.data.accessToken);
        navigate("/MainPageAfter");
      })
      .catch((err) => {
        console.error("🔥 Kakao login error:", err);
        // 에러 시 로그인 페이지로 돌려보냅니다
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, navigate, connectWebSocket]);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        카카오 로그인 진행중...
      </div>
    );
  }

  // 성공 리다이렉트 후 또는 에러 시 바로 다른 페이지로 이동하므로 빈 화면 반환
  return null;
};

export default KakaoCallback;
