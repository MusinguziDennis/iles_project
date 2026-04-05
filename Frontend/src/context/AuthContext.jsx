import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // TEMPORARY: Set a mock user for development
  useState(() => {
    setUser({
      username: 'Tracy komu',
      email: 'tracy@22.com',
      role: 'student'
    });
  }, []);

  const login = async (username, password) => {
    console.log('Login attempted:', username);
    setUser({ username, role: 'student' });
    return { username, role: 'student' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};