import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * Este componente protege rutas privadas y muestra
 * una pantalla de carga mientras verifica la sesión.
 */
export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useUser();

  useEffect(() => {
    // Simulamos un breve retardo para mostrar el loader
    setTimeout(() => {
      setLoading(false);
    }, 600); // 0.6 segundos
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
