import React, { useState, useEffect, useRef, useCallback } from "react";
import FollowTab from "../../components/FollowTab/FollowTab";
import FollowDelete from "../../components/FollowDelete/FollowDelete";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import api from "../../api/instance";
import "./FollowPage.css";

export const FollowPage = () => {
  const [followers, setFollowers] = useState([]); // 나를 팔로우하는 사람 ID 배열
  const [followees, setFollowees] = useState([]); // 내가 팔로우하는 사람 ID 배열
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("follow"); // 기본값: "follow" (내가 팔로우하는 사람)
  const observer = useRef(null);

  const USERS_PER_PAGE = 10;

  // 탭 전환 시 페이징 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  // “나를 팔로우하는 사람” 목록 가져오기
  useEffect(() => {
    if (selectedTab !== "follower") return;
    if (followers.length > 0) return;

    const fetchFollowers = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/follow/followers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // res.data.data: [1,2,7,15] 형태
        setFollowers(res.data.data);
      } catch (err) {
        console.error("팔로워 목록 조회 실패:", err);
      }
    };

    fetchFollowers();
  }, [selectedTab, followers.length]);

  // “내가 팔로우하는 사람” 목록 가져오기
  useEffect(() => {
    if (selectedTab !== "follow") return;
    if (followees.length > 0) return;

    const fetchFollowees = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get("/user-service/follow/followees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowees(res.data.data);
      } catch (err) {
        console.error("팔로잉 목록 조회 실패:", err);
      }
    };

    fetchFollowees();
  }, [selectedTab, followees.length]);

  // 현재 탭에 해당하는 ID 배열을 객체 형태로 변환 (표시용)
  const currentIds = selectedTab === "follower" ? followers : followees;
  const currentList = currentIds.map((id) => ({ id, name: `User ${id}` }));

  // 페이지네이션 처리: 0 ~ page * USERS_PER_PAGE 까지만 보여줌
  const visibleUsers = currentList.slice(0, page * USERS_PER_PAGE);

  // 더 불러올 데이터가 있는지 판단
  useEffect(() => {
    setHasMore(visibleUsers.length < currentList.length);
  }, [visibleUsers.length, currentList.length]);

  // 무한 스크롤 Intersection Observer 설정
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

  // 삭제(언팔로우) 버튼 클릭 시 API 호출 후 상태 업데이트
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await api.delete("/user-service/follow", {
        headers: { Authorization: `Bearer ${token}` },
        data: { followeeId: userId },
      });

      // 성공 시 로컬 상태에서도 제거
      if (selectedTab === "follow") {
        setFollowees((prev) => prev.filter((id) => id !== userId));
      } else {
        setFollowers((prev) => prev.filter((id) => id !== userId));
      }
    } catch (err) {
      console.error("언팔로우 요청 실패:", err);
    }
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="followpage-wrapper">
        <div className="followpage-container" style={{ marginTop: "100px" }}>
          {/* 탭 순서: “Follower” (나를 팔로우함) 왼쪽, “Follow” (내가 팔로우함) 오른쪽 */}
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
