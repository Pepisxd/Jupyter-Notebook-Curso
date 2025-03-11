import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user } = useAuth();

  if (!user || (requiredRole && user.rol !== requiredRole)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
