import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'vendedor';
  document: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cargar usuario desde localStorage al inicializar
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      }
    };

    loadUser();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios internos (cuando se actualiza desde la misma pestaña)
    const handleUserUpdate = () => {
      loadUser();
    };

    // Crear un evento personalizado para notificar cambios
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('userUpdated'));
  };

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('userUpdated'));
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </UserContext.Provider>
  );
};
