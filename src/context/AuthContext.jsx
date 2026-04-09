import { createContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('streetconnect_token');
    if (token) {
      getMe().then(res => {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }).catch(() => {
        localStorage.removeItem('streetconnect_token');
        localStorage.removeItem('streetconnect_user');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('streetconnect_token', token);
    localStorage.setItem('streetconnect_user', JSON.stringify(userData));
    setUser(userData);
    return getMe().then(res => {
      setProfile(res.data.profile);
      return res.data;
    });
  };

  const logout = () => {
    localStorage.removeItem('streetconnect_token');
    localStorage.removeItem('streetconnect_user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
