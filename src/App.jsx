// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// 화면 컴포넌트들
import MainPageBefore from "./screens/MainPageBefore/MainPageBefore";
import Login from "./screens/Login/Login";
import SignUp from "./screens/SignUp/SignUp";
import Notice from "./screens/Notice/Notice";
import MainPageAfter from "./screens/MainPageAfter/MainPageAfter";
import FollowPage from "./screens/FollowPage/FollowPage";
import Write from "./screens/Write/Write";
import GenerateReadmeScreen from "./screens/GenerateReadmeScreen/GenerateReadmeScreen";
import ForgotPassword from "./screens/ForgotPassword/ForgotPassword";
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
import PortfolioScreen from "./screens/Portfolio/PortfolioScreen";
import AuthCallBack from "./screens/Login/AuthCallBack";

// 컨텍스트 및 SSE
import SSEAlarmConnector from "./SSEAlarmConnector";
import { WebSocketProvider } from "./contexts/WebSocketContext";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 카카오 인가 코드 콜백 처리 */}
        <Route path="/oauth/kakao/redirect" element={<AuthCallBack />} />

        {/* 공개 라우트 */}
        <Route path="/" element={<MainPageBefore />} />
        <Route path="/MainPageBefore" element={<MainPageBefore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* 로그인 후 라우트 */}
        <Route path="/MainPageAfter" element={<MainPageAfter />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/write" element={<Write />} />
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/generatereadme" element={<GenerateReadmeScreen />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edituser" element={<EditUser />} />
        <Route path="/message" element={<Message />} />
        <Route path="/message-room/:id" element={<MessageRoom />} />
        <Route path="/myblog" element={<MyBlog />} />
        <Route path="/viewpost" element={<ViewPost />} />
        <Route path="/roadmapbefore" element={<RoadMapLoginBefore />} />
        <Route path="/roadmap" element={<RoadMap />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/write" element={<CommunityWrite />} />
        <Route path="/portfolio" element={<PortfolioScreen />} />
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