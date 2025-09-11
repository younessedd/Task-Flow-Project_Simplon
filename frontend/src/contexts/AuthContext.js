import React, { createContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;
      try {
        setAuthToken(token);
        const { data } = await api.get('/user');
        setUser(data);
      } catch (e) {
        logout();
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch(e) {}
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
