


import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Home";

import Dasshboard from "./pages/Dasshboard";
import AdminDashboard from "./pages/AdminDashboard";
import InterviewPage from "./pages/User/InterviewPage";
import ReportPage from "./pages/User/ReportPage";
import QuestionManagementPage from "./pages/Admin/QuestionManegementPage";
import UserManagementPage from "./pages/Admin/UserManagementPage";
import ProgressPage from "./pages/User/ProgressPage";
import ProfilePage from "./pages/User/Profilepage";



import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

const App = () => {
  return (
    <Routes>
      {/* Layout Route */}
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* User */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dasshboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview/:sessionId"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report/:sessionId"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        

<Route
  path="/progress"
  element={
    <ProtectedRoute>
      <ProgressPage />
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

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <QuestionManagementPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;