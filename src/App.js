import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Audit from "./pages/Audit";
import Profile from "./pages/Profile";
import EmployeeDetails from "./pages/EmployeeDetails";
import Tasks from "./pages/Tasks";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { updatePreferences } from "./api/userApi";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="auth-page"><div className="auth-card">Loading session...</div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, refreshUser } = useAuth();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (user) {
      setTheme(user.preferences?.theme || "dark");
    } else {
      setTheme("dark");
    }
  }, [user]);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function handleLoginSuccess() {
    navigate("/dashboard");
  }

  async function toggleTheme() {
    if (!user) {
      return;
    }

    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    try {
      await updatePreferences({ theme: newTheme });
      await refreshUser();
    } catch (error) {
      setTheme(user.preferences?.theme || "dark");
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Login onLoginSuccess={handleLoginSuccess} />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Register />
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/employees"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Employees onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Audit onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings
              theme={theme}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
