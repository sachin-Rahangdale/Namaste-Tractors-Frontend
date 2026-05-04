import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for token when the app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setUser({ token, role });
    }
  }, []);

  const loginState = (userData) => {
    setUser(userData);
  };

  const logoutState = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginState, logoutState }}>
      {children}
    </AuthContext.Provider>
  );
};