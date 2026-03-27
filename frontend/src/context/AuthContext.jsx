// src/context/AuthContext.js
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContext";
import { getProfile } from "../api"; // your API call to fetch user profile

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("access")));

  // Check authentication on app load
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      return;
    }

    getProfile()
      .then((user) => {
        setIsLoggedIn(true);
        setUserRole(user.role || "user");
        const resolvedUsername = user.username || localStorage.getItem("username") || "";
        if (resolvedUsername) {
          localStorage.setItem("username", resolvedUsername);
        }
        setUsername(resolvedUsername);
      })
      .catch(() => {
        // Invalid token
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUserRole("");
        setUsername("");
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUserRole("");
    setUsername("");
  }, []);

  const login = useCallback((role, accessToken, refreshToken, username) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
    setUserRole(role);
    setUsername(username || "");
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
