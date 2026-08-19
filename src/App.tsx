import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FindAccountPage from './pages/FindAccountPage';
import ProfilePage from './pages/ProfilePage';
import DeactivatePage from './pages/DeactivatePage';
import ChangeIdPage from './pages/ChangeIdPage';
import SettingPage from './pages/SettingPage';
import NotebookPage from './pages/NotebookPage';
import LibraryPage from './pages/LibraryPage';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />

          {/* 사이드바 없이 전체 화면으로 여는 페이지 (NotebookLM 스타일 3분할 캔버스) */}
          <Route
            path="/notebook/:id"
            element={
              <ProtectedRoute>
                <NotebookPage />
              </ProtectedRoute>
            }
          />

          {/* 새 디자인에는 고정 사이드바가 없습니다 — 각 페이지가 자체 헤더(아바타 드롭다운 등)를 가집니다 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-id"
            element={
              <ProtectedRoute>
                <ChangeIdPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/deactivate"
            element={
              <ProtectedRoute>
                <DeactivatePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
