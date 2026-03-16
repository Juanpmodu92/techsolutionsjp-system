import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken
} from '../../../lib/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  async function fetchMe() {
    const response = await api.get('/auth/me');
    setUser(response.data.data);
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const nextToken = response.data.data.token;
    const nextUser = response.data.data.user;

    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);

    return response.data;
  }

  function logout() {
    removeAuthToken();
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        await fetchMe();
      } catch {
        removeAuthToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      logout
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}