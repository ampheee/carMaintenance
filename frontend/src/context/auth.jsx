import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { apiClient } from "../lib/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(Cookies.get("session") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session) {
        console.log("Session found. Fetching user details...");
        try {
          const response = await apiClient.get("/user");
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user details:", err);
          Cookies.remove("session");
          setSession(null);
          setUser(null);
        }
      } else {
        console.log("No session found.");
      }
      setIsLoading(false);
    };

    fetchUserDetails();
  }, [session]);

  const loginAction = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/login", credentials);
      
      const sessionFromCookie = Cookies.get("session");
      if (sessionFromCookie) {
        setSession(sessionFromCookie);
        const userResponse = await apiClient.get("/user");
        setUser(userResponse.data);
      } else {
        throw new Error("Session not found in cookies.");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(
        err.response?.data?.message ||
          "Не удалось войти. Проверьте введенные данные или попробуйте позже."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const registerAction = async (userData) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post("/register", userData);
      return response.data;
    } catch (err) {
      console.error("Registration error:", err);
      throw new Error(
        err.response?.data?.message ||
          "Ошибка при регистрации. Попробуйте снова."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await apiClient.post("/logout").catch(() => {
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setSession(null);
      Cookies.remove("session");
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    loginAction,
    registerAction,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;