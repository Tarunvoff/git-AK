import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

function getUserFromToken(token: string | null) {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<any>(() => getUserFromToken(localStorage.getItem('token')));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUser(getUserFromToken(token));
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated };
}
