import React, { useState, useEffect, useRef, useCallback } from "react";
import FollowTab from "../../components/FollowTab/FollowTab";
import FollowDelete from "../../components/FollowDelete/FollowDelete";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import api from "../../api/instance";
import "./FollowPage.css";

export const FollowPage = () => {
  const [followers, setFollowers] = useState([]); // 나를 팔로우한 사람 ID
  const [followees, setFollowees] = useState([]); // 내가 팔로우한 사람 ID
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("follow"); // 기본 탭
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

  // 현재 탭에 맞는 ID 리스트 생성
  const currentIds = selectedTab === "follower" ? followers : followees;
  const currentList = currentIds.map((id) => ({ id, name: `User ${id}` }));

  // 보일 사용자 목록 (페이지 단위)
  const visibleUsers = currentList.slice(0, page * USERS_PER_PAGE);

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

  // 삭제(언팔로우 또는 팔로워 제거)
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (selectedTab === "follow") {
        // 언팔로우
        await api.delete("/user-service/follow", {
          headers: { Authorization: `Bearer ${token}` },
          data: { followeeId: userId },
        });
        setFollowees((prev) => prev.filter((id) => id !== userId));
      } else {
        // 팔로워 삭제
        await api.delete("/user-service/follow/remove-follower", {
          headers: { Authorization: `Bearer ${token}` },
          data: { followerId: userId },
        });
        setFollowers((prev) => prev.filter((id) => id !== userId));
      }
    } catch (err) {
      console.error("삭제 요청 실패:", err);
    }
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
            {visibleUsers.map((user, idx) => (
              <div
                className="followpage-user-row"
                key={user.id}
                ref={idx === visibleUsers.length - 1 ? lastUserRef : null}
              >
                <div className="followpage-user-info">
                  <div className="followpage-avatar" />
                  <div className="followpage-username">{user.name}</div>
                </div>
                <FollowDelete
                  className="followpage-delete-button"
                  tabType={selectedTab}
                  onDelete={() => handleDeleteUser(user.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 스크롤 업 버튼 */}
      <div className="followpage-scrollup-wrapper">
        <div className="followpage-scrollup-inner">
          <ScrollUp className="followpage-scrollup-icon" />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default FollowPage;
