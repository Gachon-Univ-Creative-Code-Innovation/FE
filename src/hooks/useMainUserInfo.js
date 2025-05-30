import { useState, useEffect } from "react";
import api from "../api/instance";

/**
 * 메인 페이지에 필요한 사용자 기본 정보 조회 훅
 * - API: GET /user-service/user/main
 * - 반환값: { userInfo, loading, error }
 */
export default function useMainUserInfo() {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    profileUrl: null,
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/user-service/user/main")
      .then(({ data: res }) => {
        if (isMounted) {
          setUserInfo(res.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { userInfo, loading, error };
}
