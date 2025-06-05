import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/instance";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    // 1) URL에서 인가 코드(code) 추출
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      navigate("/login");
      return;
    }
    
    // 2) 백엔드 카카오 로그인 API 호출
    api
      .post("/user-service/kakao/login", { code })
      .then(({ data }) => {
        // 3) 응답에서 토큰 저장
        localStorage.setItem("userId", data.data.userId);
        localStorage.setItem("jwtToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        // 4) 로그인 완료 후 메인 페이지로 이동
        navigate("/MainPageAfter");
      })
      .catch((err) => {
        // 콘솔에 상세 로그
        console.error("🔥 Kakao login error:", err);
        if (err.response) {
          console.error("📌 HTTP 상태 코드:", err.response.status);
          console.error("📌 응답 바디:", err.response.data);
          setErrorInfo({
            status: err.response.status,
            data: err.response.data,
            message: err.response.data?.message || "서버 오류가 발생했습니다.",
          });
        } else {
          setErrorInfo({
            message: err.message || "알 수 없는 오류가 발생했습니다.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, navigate]);

  // 로딩 중
  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        카카오 로그인 진행중...
      </div>
    );
  }

  // 에러 발생 시 상세 UI
  if (errorInfo) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#d00" }}>
        <h2>로그인 중 오류가 발생했습니다</h2>
        {errorInfo.status && <p>• HTTP 상태 코드: {errorInfo.status}</p>}
        {errorInfo.data && (
          <pre style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(errorInfo.data, null, 2)}
          </pre>
        )}
        <p>{errorInfo.message}</p>
        <button onClick={() => navigate("/login")}>
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  // 성공 또는 이미 리다이렉트된 경우 빈 화면
  return null;
};

export default AuthCallback;
