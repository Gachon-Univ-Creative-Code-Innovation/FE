import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// 화면 컴포넌트들
import MainPageBefore from "./screens/MainPageBefore/MainPageBefore";
import Login from "./screens/Login/Login";
import SignUp from "./screens/SignUp/SignUp";
import TermsOfService from "./screens/SignUp/TermsOfService";
import PrivacyPolicy from "./screens/SignUp/PrivacyPolicy";
import Notice from "./screens/Notice/Notice";
import MainPageAfter from "./screens/MainPageAfter/MainPageAfter";
import FollowPage from "./screens/FollowPage/FollowPage";
import Write from "./screens/Write/Write";
import GenerateReadmeScreen from "./screens/GenerateReadmeScreen/GenerateReadmeScreen";
import ForgotPassword from "./screens/ForgotPassword/ForgotPassword";
import ResetPassword from "./screens/ResetPassword/ResetPassword";
import KakaoCallBack from "./screens/Login/KakaoCallBack";
import GoogleCallback from "./screens/Login/GoogleCallBack";
import MainPageAfter from "./screens/MainPageAfter/MainPageAfter";
import Notice from "./screens/Notice/Notice";
import Write from "./screens/Write/Write";
import FollowPage from "./screens/FollowPage/FollowPage";
import GenerateReadmeScreen from "./screens/GenerateReadmeScreen/GenerateReadmeScreen";
import MyPage from "./screens/MyPage/MyPage";
import EditUser from "./screens/EditUser/EditUser";
import Message from "./screens/Message/Message";
import MessageRoom from "./screens/MessageRoom/MessageRoom";
import MyBlog from "./screens/MyBlog/MyBlog";
import ViewPost from "./screens/ViewPost/ViewPost";
import RoadMapLoginBefore from "./screens/RoadMapLoginBefore/RoadMapLoginBefore";
import RoadMap from "./screens/RoadMap/RoadMap";
import Community from "./screens/Community/Community";
import CommunityWrite from "./screens/CommunityWrite/CommunityWrite";
import CommunityViewPost from "./screens/CommunityViewPost/CommunityViewPost";
import PortfolioScreen from "./screens/Portfolio/PortfolioScreen";
import PortfolioWrite from "./screens/PortfolioWrite/PortfolioWrite";
import PortfolioView from "./screens/PortfolioView/PortfolioView";

// SSE 및 Context
import SSEAlarmConnector from "./SSEAlarmConnector";
import { WebSocketProvider } from "./contexts/WebSocketContext";

const AnimatedRoutes = () => {
  const location = useLocation();
  // pathname과 search를 함께 넘겨준다.
  const onlyPathnameAndSearch = {
    pathname: location.pathname,
    search: location.search,
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={onlyPathnameAndSearch} key={location.pathname}>
        {/* 첫 진입 시 토큰이 있으면 MainPageAfter로, 아니면 MainPageBefore */}
        <Route
          path="/"
          element={
            localStorage.getItem("jwtToken") &&
            localStorage.getItem("refreshToken") ? (
              <Navigate to="/MainPageAfter" replace />
            ) : (
              <MainPageBefore />
            )
          }
        />

        {/* 공개 라우트 */}
        <Route path="/MainPageBefore" element={<MainPageBefore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/terms" element={<TermsOfService />} />
        <Route path="/signup/privacy" element={<PrivacyPolicy />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/" element={<ResetPassword />} />

        {/* 소셜 로그인 콜백 */}
        <Route path="/oauth/kakao/redirect" element={<KakaoCallBack />} />
        <Route path="/oauth/google/redirect" element={<GoogleCallback />} />

        {/* 로그인 후 라우트 */}
        <Route path="/MainPageAfter" element={<MainPageAfter />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/write" element={<Write />} />
        <Route path="/write/:postId" element={<Write />} />
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/generatereadme" element={<GenerateReadmeScreen />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edituser" element={<EditUser />} />
        <Route path="/message" element={<Message />} />
        <Route path="/message-room/:id" element={<MessageRoom />} />
        <Route path="/myblog" element={<MyBlog />} />
        <Route path="/viewpost" element={<ViewPost />} />
        <Route path="/viewpost/:postId" element={<ViewPost />} />
        <Route path="/roadmapbefore" element={<RoadMapLoginBefore />} />
        <Route path="/roadmap" element={<RoadMap />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/write" element={<CommunityWrite />} />
        <Route path="/community/viewpost/:id" element={<CommunityViewPost />} />
        <Route path="/portfolio" element={<PortfolioScreen />} />
        <Route path="/portfolio/write" element={<PortfolioWrite />} />
        <Route path="/portfolio/view/:id" element={<PortfolioView />} />
      </Routes>
    </AnimatePresence>
  );
};

export const App = () => (
  <>
    <SSEAlarmConnector />
    <WebSocketProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </WebSocketProvider>
  </>
);

export default App;
