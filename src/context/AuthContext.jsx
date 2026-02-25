import React, { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('portalUser');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = DUMMY_USERS.find(
      (u) => u.email === email.trim() && u.password === password
    );
    if (found) {
      const { password: _p, ...safeUser } = found;
      sessionStorage.setItem('portalUser', JSON.stringify(safeUser));
      setUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const logout = () => {
    sessionStorage.removeItem('portalUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
