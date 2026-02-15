import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/Auth_page.jsx";
import ProtectedRoute from "../protectedPages/ProtectedRoute.jsx";

import Dashboard from "../protectedPages/pages/Dashboard.jsx";
import Overview from "../protectedPages/pages/Overview.jsx";
import Endpoints from "../protectedPages/pages/Endpoints.jsx";
import Settings from "../protectedPages/pages/Settings.jsx";
import Usage from "../protectedPages/pages/Usage.jsx";
import ApiKeys from "../protectedPages/pages/ApiKeys.jsx";
import Users from "../protectedPages/pages/Users.jsx";

const GlobalRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<AuthPage />} />

      {/* Protected layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* ✅ DEFAULT CHILD = Overview */}
        <Route index element={<Overview />} />

        {/* Other children */}
        <Route path="dashboard/endpoints" element={<Endpoints />} />
        <Route path="dashboard/settings" element={<Settings />} />
        <Route path="dashboard/usage" element={<Usage />} />
        <Route path="dashboard/api-keys" element={<ApiKeys />} />
        <Route path="dashboard/users" element={<Users />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default GlobalRoutes;
