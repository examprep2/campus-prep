import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../features/auth/LoginPage';
import SignupPage from '../features/auth/SignupPage';
import VerifyOtpPage from '../features/auth/VerifyOtpPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';

// Layouts & Route Guards
import StudentLayout from '../components/layout/StudentLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

// Student Pages
import StudentDashboardPage from '../features/dashboard/StudentDashboardPage';
import MaterialsPage from '../features/materials/MaterialsPage';
import UploadMaterialPage from '../features/uploads/UploadMaterialPage';
import MyUploadsPage from '../features/uploads/MyUploadsPage';
import NotificationsPage from '../features/notifications/NotificationsPage';

// Admin Pages
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import AdminMaterialsPage from '../features/admin/AdminMaterialsPage';
import AdminUsersPage from '../features/admin/AdminUsersPage';
import AdminBranchesPage from '../features/admin/AdminBranchesPage';
import AdminSubjectsPage from '../features/admin/AdminSubjectsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Student Workspace */}
      <Route
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/upload" element={<UploadMaterialPage />} />
        <Route path="/my-uploads" element={<MyUploadsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Protected Admin Console */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="materials" element={<AdminMaterialsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="branches" element={<AdminBranchesPage />} />
        <Route path="subjects" element={<AdminSubjectsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

