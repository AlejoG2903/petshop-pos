import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface HeaderProps {
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export default function Header({ onToggleDarkMode, darkMode }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Opciones de menú según el rol
  const getMenuItems = () => {
    if (!user) return [];
    
    if (user.role === "admin") {
      return [
        { path: "/", label: "Dashboard", icon: "📊" },
        { path: "/products", label: "Productos", icon: "📦" },
        { path: "/sales", label: "Ventas", icon: "💰" },
      ];
    } else {
      return [
        { path: "/sales", label: "Registrar Venta", icon: "💰" },
      ];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <h1
            className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            🐾 PetShop POS
          </h1>

          {/* Menú de navegación - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Controles del usuario */}
          <div className="flex items-center gap-4">
            {user?.name && (
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                👋 {user.name}
              </span>
            )}

            {/* Botón de modo oscuro */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
              title="Cambiar tema"
              aria-label="Cambiar tema oscuro/claro"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive(item.path)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
