import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/instance";
import { useWebSocket } from "../../contexts/WebSocketContext";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const { connectWebSocket } = useWebSocket();

  useEffect(() => {
    console.log("현재 콜백 URL:", window.location.href);
    // 1) URL에서 인가 코드(code) 추출
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      // 코드가 없으면 로그인 페이지로
      navigate("/login");
      return;
    }

    // 2) 백엔드 Google 로그인 API 호출
    api
      .post("/user-service/google/login", { code })
      .then(({ data }) => {
        // 3) 응답에서 토큰 및 사용자 ID 저장
        const { accessToken, refreshToken, userId } = data.data;
        if (userId) localStorage.setItem("userId", userId);
        localStorage.setItem("jwtToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        connectWebSocket(accessToken);
        navigate("/MainPageAfter");
      })
      .catch((err) => {
        // 오류가 발생하면 콘솔에 로그를 남기고 로그인 페이지로
        console.error("🔥 Google login error:", err);
        navigate("/login");
      })
      .finally(() => {
        // 로딩 상태 해제
        setLoading(false);
      });
  }, [search, navigate, connectWebSocket]);

  // 로딩 중 표시
  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Google 로그인 진행중...
      </div>
    );
  }

  // 성공 또는 실패 시 이미 리다이렉트되었으므로 빈 화면 반환
  return null;
};

export default GoogleCallback;
