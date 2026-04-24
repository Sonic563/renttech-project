import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/Api';

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
      localStorage.setItem('currentUser', JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

 
  const register = async (data) => {
    try {
      const res = await authAPI.register(data);

      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };


  const updateUserProfile = async (id, profileData) => {
  try {
    const updated = await userAPI.updateProfile(id, profileData, token);
    localStorage.setItem('currentUser', JSON.stringify(updated));
    setUser(updated);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
};



  const changePassword = async (id, passwordData) => {
    try {
      await userAPI.changePassword(id, passwordData, token);
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
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUserProfile,
      changePassword,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
