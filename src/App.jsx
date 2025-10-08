import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout Components
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import PublicHome from "./pages/PublicHome";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Students from "./pages/Students";
import AddStudent from "./pages/Students/AddStudent";
import EditStudent from "./pages/Students/EditStudent";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app">
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route
            path="courses"
            element={<NotFound message="Courses feature coming soon" />}
          />
          <Route
            path="reports"
            element={<NotFound message="Reports feature coming soon" />}
          />
          <Route
            path="settings"
            element={<NotFound message="Settings feature coming soon" />}
          />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
