import React, { useState, useEffect, useRef, useCallback } from "react";
import FollowTab from "../../components/FollowTab/FollowTab";
import FollowDelete from "../../components/FollowDelete/FollowDelete";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ScrollUp from "../../icons/ScrollUp/ScrollUp";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./FollowPage.css";

export const FollowPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("follow");

  const observer = useRef(null);

  const USERS_PER_PAGE = 10;
  const MAX_USERS = 50;

  useEffect(() => {
    const users = Array.from({ length: MAX_USERS }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
    }));
    setAllUsers(users);
  }, []);

  const filteredUsers = allUsers.filter((user) => !deletedIds.has(user.id));
  const visibleUsers = filteredUsers.slice(0, page * USERS_PER_PAGE);

  useEffect(() => {
    setHasMore(visibleUsers.length < filteredUsers.length);
  }, [visibleUsers.length, filteredUsers.length]);

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

  const handleDeleteUser = (userId) => {
    setDeletedIds((prev) => new Set(prev).add(userId));
  };

  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="followpage-wrapper">
        <div className="followpage-container" style={{ marginTop: "100px" }}>
          <div className="followpage-category">
            <FollowTab
              type="follow"
              isSelected={selectedTab === "follow"}
              onClick={() => setSelectedTab("follow")}
            />
            <FollowTab
              type="follower"
              isSelected={selectedTab === "follower"}
              onClick={() => setSelectedTab("follower")}
            />
          </div>

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

      <div className="followpage-scrollup-wrapper">
        <div className="followpage-scrollup-inner">
          <ScrollUp className="followpage-scrollup-icon" />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default FollowPage;
