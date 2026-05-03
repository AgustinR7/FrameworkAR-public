import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { config } from '../config';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasSeenIntro: boolean;
  markIntroAsSeen: () => void;
  updateUser: (data: Partial<User>) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return sessionStorage.getItem('hasSeenIntro') === 'true';
  });
  
  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/api/auth/verify`, {
          withCredentials: true 
        });
        setUser(data.user); 
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const markIntroAsSeen = () => {
    setHasSeenIntro(true);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  const login = (userData: User) => {
    setUser(userData);
    setHasSeenIntro(false);
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setHasSeenIntro(false);
      sessionStorage.removeItem('hasSeenIntro');
      await axios.post(`${config.apiUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch(e) {}
    
    setUser(null);
    setHasSeenIntro(false);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  if (isLoading) {
    return <div style={{ height: '100vh', background: '#0f172a' }}></div>; 
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout,
      hasSeenIntro,
      markIntroAsSeen,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};