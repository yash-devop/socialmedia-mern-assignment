import { BACKEND_URL } from "@/config/constants";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  email: string;
  name: string;
  profilePicture: string;
  id: string;
};
type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const getUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      const userData:User = data;
      console.log('data',userData);
      setUser(userData);
    } catch (error) {
      console.log("Error in useAuth", error);
      setUser(null);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
