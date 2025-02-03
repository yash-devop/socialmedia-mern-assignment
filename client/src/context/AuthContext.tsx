import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/config/constants";

type User = {
  email: string;
  name: string;
  profilePicture: string;
  _id: string;
};

type AuthContextType = {
  user: User | null;
  isAuthCheckComplete: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthCheckComplete: false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        credentials: "include",
      });

      if (response.ok) {
        const data: User = await response.json();
        console.log('data',data);
        setUser(data);
      }
    } catch {
      setUser(null);
    } finally {
      setIsAuthCheckComplete(true);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthCheckComplete, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
