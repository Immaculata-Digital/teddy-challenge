import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/auth.service';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loginState: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Carrega imediatamente do localStorage para evitar flicker no nome
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          // Só atualiza se o perfil veio completo com fullName
          if (profile && profile.fullName) {
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          }
          // Se não veio completo, mantém o user do localStorage (já carregado no useState)
        } catch (error) {
          console.error('Failed to load user profile', error);
          // Não limpa se já temos user em cache — apenas limpa se o token é realmente inválido (401)
          const status = (error as any)?.message?.includes('401') || (error as any)?.status === 401;
          if (status) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const loginState = (loggedUser: User, token: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginState, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
