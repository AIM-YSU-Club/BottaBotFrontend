import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FindAccountPage from './pages/FindAccountPage';
import ProfilePage from './pages/ProfilePage';
import DeactivatePage from './pages/DeactivatePage';
import ChangeIdPage from './pages/ChangeIdPage';
import SettingPage from './pages/SettingPage';
import NotebookPage from './pages/NotebookPage';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />

          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notebook/:id"
              element={
                <ProtectedRoute>
                  <NotebookPage />
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
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
