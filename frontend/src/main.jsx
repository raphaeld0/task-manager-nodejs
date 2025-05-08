import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import DashboardTasks from './pages/dashboard/tasks/dashboardTasks.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Login from './pages/login/login.jsx';
import Register from './pages/register/register.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../src/service/protectedRoute.js';

const pages = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>),
  },
  {
    path: '/dashboard/tasks',
    element: (
      <ProtectedRoute>
        <DashboardTasks />
      </ProtectedRoute>),
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={pages} />
  </StrictMode>
);

