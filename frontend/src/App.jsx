import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { Login, Register } from './components/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserDashboard, ManagerDashboard, AdminDashboard } from './components/Dashboard';
import { ManageUsers } from './components/ManageUsers';
import { Unauthorized, NotFound } from './components/Unauthorized';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute requiredRoles={['user', 'manager', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/manager"
            element={
              <ProtectedRoute requiredRoles={['manager', 'admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
