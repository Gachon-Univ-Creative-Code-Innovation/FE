import React from "react";
import ArrowRightIcon from "../../icons/ArrowRightIcon/ArrowRightIcon";
import MypageUserIcon from "../../icons/MypageUserIcon/MypageUserIcon";
import MypageDocumentIcon from "../../icons/MypageDocumentIcon/MypageDocumentIcon";
import MypageLogoutIcon from "../../icons/MypageLogoutIcon/MypageLogoutIcon";
import MypageFollowIcon from "../../icons/MypageFollowIcon/MypageFollowIcon";
import MypageWithdrawIcon from "../../icons/MypageWithdrawIcon/MypageWithdrawIcon";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./MyPage.css";

export const MyPage = () => {
  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="mypage-page">
        <div className="mypage-post" style={{ marginTop: "100px" }}>
          <header className="mypage-header">
            <img
              className="mypage-profile-img"
              alt="Profile img"
              src="/img/profile-img.png"
            />
            <div className="mypage-name-wrapper">
              <div className="mypage-name">Songhui</div>
            </div>
          </header>
        </div>

        <div className="mypage-post-list">
          <div className="mypage-scrollable-div">
            <div className="mypage-item-frame">
              <MypageUserIcon className="mypage-vector" />
              <div className="mypage-text">회원정보 수정</div>
              <ArrowRightIcon className="mypage-arrow" />
            </div>

            <div className="mypage-item-frame">
              <MypageFollowIcon className="mypage-vector-2" />
              <div className="mypage-text">팔로우 관리</div>
              <ArrowRightIcon className="mypage-arrow" />
            </div>

            <div className="mypage-item-frame">
              <MypageDocumentIcon className="mypage-vector-3" />
              <div className="mypage-text">포트폴리오 관리</div>
              <ArrowRightIcon className="mypage-arrow" />
            </div>

            <div className="mypage-item-frame">
              <MypageLogoutIcon className="mypage-vector-4" />
              <div className="mypage-text">로그아웃</div>
              <ArrowRightIcon className="mypage-arrow" />
            </div>

            <div className="mypage-item-frame">
              <MypageWithdrawIcon className="mypage-vector-2" />
              <div className="mypage-text">회원 탈퇴</div>
              <ArrowRightIcon className="mypage-arrow" />
            </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default MyPage;
