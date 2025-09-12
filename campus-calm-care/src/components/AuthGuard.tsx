import React from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  userType: "student" | "counsellor";
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, userType }) => {
  const storageKey = userType === "student" ? "studentId" : "counsellorId";
  const isAuthenticated = !!localStorage.getItem(storageKey);

  if (!isAuthenticated) {
    return <Navigate to={`/${userType}-login`} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
