import React, { useState, useEffect, useRef, useCallback } from "react";
import FollowTab from "../../components/FollowTab/FollowTab";
import FollowDelete from "../../components/FollowDelete/FollowDelete";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import api from "../../api/instance";
import "./FollowPage.css";

export const FollowPage = () => {
  const [followers, setFollowers] = useState([]);
  const [followees, setFollowees] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("follow");
  const [userDetailsMap, setUserDetailsMap] = useState({});
  const observer = useRef(null);

  const USERS_PER_PAGE = 10;

  // 탭 변경 시 페이지 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  // 팔로워 목록 가져오기
  useEffect(() => {
    if (selectedTab !== "follower" || followers.length > 0) return;
    const fetchFollowers = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/follow/followers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowers(res.data.data);
      } catch (err) {
        console.error("팔로워 조회 실패:", err);
      }
    };
    fetchFollowers();
  }, [selectedTab, followers.length]);

  // 팔로잉 목록 가져오기
  useEffect(() => {
    if (selectedTab !== "follow" || followees.length > 0) return;
    const fetchFollowees = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/follow/followees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowees(res.data.data);
      } catch (err) {
        console.error("팔로잉 조회 실패:", err);
      }
    };
    fetchFollowees();
  }, [selectedTab, followees.length]);

  // 현재 탭에 따른 ID 리스트 및 페이지 단위로 자른 목록
  const currentIds = selectedTab === "follower" ? followers : followees;
  const currentList = currentIds.map((id) => ({ id }));
  const visibleUsers = currentList.slice(0, page * USERS_PER_PAGE);

  // userId 별 상세 정보 캐시
  useEffect(() => {
    const fetchDetails = async (userId) => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get(`/user-service/details/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
      } catch {
        return null;
      }
    };

    visibleUsers.forEach((user) => {
      if (!userDetailsMap[user.id]) {
        fetchDetails(user.id).then((detail) => {
          if (detail) {
            setUserDetailsMap((prev) => ({
              ...prev,
              [user.id]: detail,
            }));
          }
        });
      }
    });
  }, [visibleUsers, userDetailsMap]);

  // 더 불러올 데이터 여부
  useEffect(() => {
    setHasMore(visibleUsers.length < currentList.length);
  }, [visibleUsers.length, currentList.length]);

  // 무한 스크롤 설정
  const lastUserRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // 언팔로우 또는 팔로워 삭제
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (selectedTab === "follow") {
        await api.delete("/user-service/follow", {
          headers: { Authorization: `Bearer ${token}` },
          data: { followeeId: userId },
        });
        setFollowees((prev) => prev.filter((id) => id !== userId));
      } else {
        await api.delete("/user-service/follow/remove-follower", {
          headers: { Authorization: `Bearer ${token}` },
          data: { followerId: userId },
        });
        setFollowers((prev) => prev.filter((id) => id !== userId));
      }
      setUserDetailsMap((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (err) {
      console.error("삭제 요청 실패:", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="followpage-wrapper">
        <div className="followpage-container" style={{ marginTop: "100px" }}>
          {/* 탭 */}
          <div className="followpage-category">
            <FollowTab
              type="follower"
              isSelected={selectedTab === "follower"}
              onClick={() => setSelectedTab("follower")}
            />
            <FollowTab
              type="follow"
              isSelected={selectedTab === "follow"}
              onClick={() => setSelectedTab("follow")}
            />
          </div>

          {/* 사용자 목록 */}
          <div className="followpage-user-list">
            {visibleUsers.map((user, idx) => {
              const detail = userDetailsMap[user.id];
              return (
                <div
                  className="followpage-user-row"
                  key={user.id}
                  ref={idx === visibleUsers.length - 1 ? lastUserRef : null}
                >
                  <div className="followpage-user-info">
                    <img
                      src={detail?.profileUrl || "/img/basic_profile_photo.png"}
                      alt="profile"
                      className="followpage-avatar"
                    />
                    <div className="followpage-username">
                      {detail?.nickname || `User ${user.id}`}
                    </div>
                  </div>
                  <FollowDelete
                    className="followpage-delete-button"
                    tabType={selectedTab}
                    onDelete={() => handleDeleteUser(user.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 스크롤 업 버튼 */}
      <div className="followpage-scrollup-wrapper" onClick={scrollToTop}>
        <div className="followpage-scrollup-inner">
          <ScrollUp className="followpage-scrollup-icon" />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default FollowPage;
