import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/Api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      authAPI.getCurrentUser(token)
        .then(userData => {
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));  // <- HIÁNYZOTT!
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));  // <- HIÁNYZOTT!
        setToken(res.token);
        setUser(res.user);
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, login, register, logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};