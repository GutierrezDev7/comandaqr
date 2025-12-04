import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'waiter';
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login for admin
    if (email === 'admin@comandaqr.com' && password === 'admin123') {
      setUser({
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@comandaqr.com',
        role: 'admin',
      });
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const loginWithGoogle = async () => {
    // Mock Google OAuth
    setUser({
      id: 'user-' + Date.now(),
      name: 'João Silva',
      email: 'joao.silva@gmail.com',
      role: 'client',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
