import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AuthProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) return null; // Don't show anything until user state is determined

  return user ? children : <Navigate to="/login" replace />;
}