import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthCheckComplete } = useAuth();

  // rreturning the protected content after auth check completion
  if (!isAuthCheckComplete) {
    return null;
  }

  return user ? children : <Navigate to="/" replace />;
}
