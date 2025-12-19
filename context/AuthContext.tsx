import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  currentUser: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// FIX: Extracted props to a dedicated interface to address a potential type-checking issue.
interface AuthProviderProps {
  children: ReactNode;
}

// FIX: Explicitly typed AuthProvider with React.FC to resolve issue with children prop type inference.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    // Check for user session on initial load
    const storedUser = localStorage.getItem('skylog_currentUser');
    // For preview purposes, default to a logged-in user if none is stored.
    return storedUser || 'preview@skylog.com';
  });

  const getUsers = () => {
    const users = localStorage.getItem('skylog_users');
    return users ? JSON.parse(users) : {};
  };

  const signup = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const users = getUsers();
      if (users[email]) {
        return reject(new Error('An account with this email already exists.'));
      }
      users[email] = { password }; // Note: Storing passwords in plain text is not secure for production.
      localStorage.setItem('skylog_users', JSON.stringify(users));
      localStorage.setItem('skylog_currentUser', email);
      setCurrentUser(email);
      resolve();
    });
  };

  const login = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const users = getUsers();
        if (!users[email] || users[email].password !== password) {
            return reject(new Error('Invalid email or password.'));
        }
        localStorage.setItem('skylog_currentUser', email);
        setCurrentUser(email);
        resolve();
    });
  };

  const loginWithGoogle = (credential: string) => {
    try {
      // For a client-side app, we can decode the JWT to get the user's info.
      // In a production app, this token should be sent to a backend for secure verification.
      const payload = JSON.parse(atob(credential.split('.')[1]));
      const email = payload.email;
      if (email) {
        // We can also add the user to our user list if they don't exist,
        // without a password, to signify they are a Google user.
        const users = getUsers();
        if (!users[email]) {
            users[email] = { source: 'google' };
            localStorage.setItem('skylog_users', JSON.stringify(users));
        }
        localStorage.setItem('skylog_currentUser', email);
        setCurrentUser(email);
      } else {
        throw new Error("Email not found in Google credential.");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };


  const logout = () => {
    localStorage.removeItem('skylog_currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};