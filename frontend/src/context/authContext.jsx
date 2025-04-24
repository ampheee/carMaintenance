// src/context/authContext.js
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useLoading } from "../components/loading";
import { apiClient } from "../lib/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [Session, setSession] = useState(Cookies.get("session") || null);

  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (Session) {
        console.log("session found. Fetching user details...");
        try {
          const response = await apiClient.get("/userinfo");
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user details:", err);
          Cookies.remove("session");
          setSession(null);
        }
      } else {
        console.log("No Session found.");
      }

      setLoading(false);
    };
  
    fetchUserDetails();
  }, [Session]);

  const loginAction = async (data) => {
    try {
      await apiClient.post("/login", data);
      const SessionFromCookie = Cookies.get("session");
      if (SessionFromCookie) {
        setSession(SessionFromCookie);
      } else {
        throw new Error("session not found in cookies.");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(
        err.response?.data?.message ||
          "Не удалось войти. Проверьте введенные данные или попробуйте позже."
      );
    }
  };

  const signOut = () => {
    setUser(null);
    setSession(null);
    Cookies.remove("session");
  };

  return (
    <AuthContext.Provider value={{ user, Session, isLoading, loginAction, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthProvider;