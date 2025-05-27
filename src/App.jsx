// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainPageBefore from "./screens/MainPageBefore/MainPageBefore";
import Login from "./screens/Login/Login";
import SignUpScreen from "./screens/SignUpScreen/SignUpScreen";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainPageBefore />} />
        <Route path="/MainPageBefore" element={<MainPageBefore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpScreen />} /> {/* ✅ 추가 */}
      </Routes>
    </AnimatePresence>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};
