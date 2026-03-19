import { useState, useCallback, useEffect } from "react";
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

import { isAuthenticated, logoutUser, getCurrentUser } from "./utils/auth";

function AppRoutes() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const savedTheme = localStorage.getItem(`theme_${user.email}`) || "dark";
      setTheme(savedTheme);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  const handleLogout = useCallback(() => {
    logoutUser("manual");
    setLoggedIn(false);
    navigate("/");
  }, [navigate]);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    navigate("/dashboard");
  };

  const toggleTheme = () => {
    const user = getCurrentUser();
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    if (user) {
      localStorage.setItem(`theme_${user.email}`, newTheme);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!loggedIn || !isAuthenticated()) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          loggedIn && isAuthenticated()
            ? <Navigate to="/dashboard" replace />
            : <Login onLoginSuccess={handleLoginSuccess} />
        }
      />

      <Route path="/register" element={<Register />} />

      {/* Dashboard with nested routes */}
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
          <ProtectedRoute>
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
        path="/audit"
        element={
          <ProtectedRoute>
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

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;



