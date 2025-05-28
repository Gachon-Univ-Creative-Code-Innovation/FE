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
<<<<<<< HEAD
import Write from "./screens/Write/Write";
import "./App.css";
=======
import GenerateReadmeScreen from "./screens/GenerateReadmeScreen/GenerateReadmeScreen";
import ForgotPassword from "./screens/ForgotPassword/ForgotPassword";
import MyPage from "./screens/MyPage/MyPage";
import EditUser from "./screens/EditUser/EditUser";
import Message from "./screens/Message/Message";
import MessageRoom from "./screens/MessageRoom/MessageRoom";
import MyBlog from "./screens/MyBlog/MyBlog";
import RoadMap from "./screens/RoadMap/RoadMap";
import RoadMapLoginBefore from "./screens/RoadMapLoginBefore/RoadMapLoginBefore";
import Community from "./screens/Community/Community";
import PortfolioScreen from "./screens/Portfolio/PortfolioScreen";

// 컨텍스트 및 SSE
import SSEAlarmConnector from "./SSEAlarmConnector";
import { WebSocketProvider } from "./contexts/WebSocketContext";
>>>>>>> cf8ea84c108627957fe519ff3eb6aa6804300570

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainPageBefore />} />
        <Route path="/MainPageBefore" element={<MainPageBefore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/MainPageAfter" element={<MainPageAfter />} />
<<<<<<< HEAD
        <Route path="/follow" element={<FollowPage />} />{" "}
        <Route path="/write" element={<Write />} />
=======
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/generatereadme" element={<GenerateReadmeScreen />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edituser" element={<EditUser />} />
        <Route path="/message" element={<Message />} />
        <Route path="/message-room/:id" element={<MessageRoom />} />
        <Route path="/myblog" element={<MyBlog />} />
        <Route path="/roadmap" element={<RoadMap />} />
        <Route path="/roadmapbefore" element={<RoadMapLoginBefore />} />
        <Route path="/community" element={<Community />} />
        <Route path="/portfolio" element={<PortfolioScreen />} />
>>>>>>> cf8ea84c108627957fe519ff3eb6aa6804300570
      </Routes>
    </AnimatePresence>
  );
};

export const App = () => {
  return (
    <>
      <SSEAlarmConnector />
      <WebSocketProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </WebSocketProvider>
    </>
  );
};

export default App;
