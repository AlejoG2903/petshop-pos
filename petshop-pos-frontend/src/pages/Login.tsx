import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // Si ya hay sesión, redirige según el rol
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/sales");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        document,
        password,
      });

      const { token, user: userData } = res.data;

      // Guarda token y usuario
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Actualiza el contexto de usuario
      setUser(userData);

      // Redirige según el rol
      if (userData.role === "admin") navigate("/");
      else navigate("/sales");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Número de documento o contraseña incorrectos"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
          Iniciar sesión 🐾
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de documento
            </label>
            <input
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="input"
              placeholder="1025432189"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded p-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-blue w-full text-center mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 Petshop POS | Sistema de gestión</p>
        </div>
      </div>
    </div>
  );
}
