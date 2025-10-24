import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface RoleRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
  fallbackPath?: string;
}

/**
 * Componente que protege rutas basándose en el rol del usuario
 */
export default function RoleRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = "/sales" 
}: RoleRouteProps) {
  const { user } = useUser();

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está permitido, redirigir
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
