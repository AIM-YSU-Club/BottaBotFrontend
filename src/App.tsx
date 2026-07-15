import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 🚀 [가져오기]: 기존에 만드신 페이지와 레이아웃들을 불러옵니다.
import MainLayout from './components/layout/MainLatyout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FindAccountPage from './pages/FindAccountPage';
import ResetPasswordPage from './pages/ResetPasswordPage.ts'; // 🚀 [추가됨]: 비밀번호 재설정 페이지 가져오기
import ProfilePage from './pages/ProfilePage';
import DeactivatePage from './pages/DeactivatePage';
import ChangeIdPage from './pages/ChangeIdPage';

// ==========================================
// 🚀 [핵심 로직]: 인증 검문소 (Protected Route) 만들기
// ==========================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // 세션 스토리지에 출입증(accessToken)이 있는지 검사합니다.
  const isAuthenticated = !!sessionStorage.getItem('accessToken');

  // 출입증이 없다면? -> 로그인 페이지('/login')로 쫓아냅니다!
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 출입증이 있다면? -> 원래 가려던 페이지(children)를 그대로 보여줍니다.
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/* 🔓 1. 누구나 접근 가능한 공개 구역 (Public Routes) */}
        {/* ========================================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        
        {/* 🚀 [추가됨]: 비밀번호 재설정 페이지는 로그인 없이 접근해야 하므로 공개 구역에 넣습니다! */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ========================================== */}
        {/* 🔒 2. 로그인 필수 구역 (Protected Routes) */}
        {/* ========================================== */}
        <Route element={<MainLayout />}>
          
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/deactivate" element={
            <ProtectedRoute>
              <DeactivatePage />
            </ProtectedRoute>
          } />
          
          <Route path="/change-id" element={
            <ProtectedRoute>
              <ChangeIdPage />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;