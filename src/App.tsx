import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout'; // (오타 수정됨)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; // 📌 누락 복구
import FindAccountPage from './pages/FindAccountPage';
import ProfilePage from './pages/ProfilePage';
import DeactivatePage from './pages/DeactivatePage';
import ChangeIdPage from './pages/ChangeIdPage'; // 📌 MainLayout 내부로 이동
import SettingPage from './pages/SettingPage'; // 📌 이름(단수형) 복구
import NotebookPage from './pages/NotebookPage';

// ==========================================
// 🚀 [핵심 로직]: 인증 검문소 (Protected Route)
// ==========================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!sessionStorage.getItem('accessToken');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/* 🔓 1. 누구나 접근 가능한 공개 구역 (Public Routes) */}
        {/* ========================================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />

        {/* ========================================== */}
        {/* 🔒 2. 로그인 필수 구역 (Protected Routes) */}
        {/* ========================================== */}
        <Route element={<MainLayout />}>
          
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="/notebook/:id" element={
            <ProtectedRoute>
              <NotebookPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/change-id" element={
            <ProtectedRoute>
              <ChangeIdPage />
            </ProtectedRoute>
          } />

          {/* 📌 /settings 로 경로명 통일 및 복구 */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          } />

          <Route path="/deactivate" element={
            <ProtectedRoute>
              <DeactivatePage />
            </ProtectedRoute>
          } />

        </Route>

        {/* 🚨 잘못된 주소로 가면 무조건 로비(홈)로 튕겨내기 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;