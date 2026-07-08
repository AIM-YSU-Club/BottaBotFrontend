import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLatyout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

// 🚀 새로 만든 페이지 2개 불러오기
import FindAccountPage from './pages/FindAccountPage';
import ChangeIdPage from './pages/ChangeIdPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />, 
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  // 🚀 경로 추가
  {
    path: '/find-account',
    element: <FindAccountPage />,
  },
  {
    path: '/change-id',
    element: <ChangeIdPage />,
  },
  {
    path: '/',
    element: <MainLayout />, 
    children: [
      {
        path: '', 
        element: <HomePage />, 
      },
      {
        path: 'profile', 
        element: <ProfilePage />, 
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;