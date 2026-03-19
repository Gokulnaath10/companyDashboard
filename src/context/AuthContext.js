import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentSession,
  login as loginRequest,
  logout as logoutRequest,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getCurrentSession();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email, password) {
    const response = await loginRequest({ email, password });
    setUser(response.user);
    return response.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }

  async function refreshUser() {
    const currentUser = await getCurrentSession();
    setUser(currentUser);
    return currentUser;
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
