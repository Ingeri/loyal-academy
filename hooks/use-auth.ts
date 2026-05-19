'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setState({ user: data.user, isLoading: false, error: null });
      } else {
        setState({ user: null, isLoading: false, error: null });
      }
    } catch (error) {
      setState({ user: null, isLoading: false, error: 'Failed to fetch user' });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        setState({ user: data.user, isLoading: false, error: null });
        router.refresh();
        return data.user;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw error;
      }
    },
    [router]
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        setState({ user: data.user, isLoading: false, error: null });
        router.refresh();
        return data.user;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Signup failed';
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      setState({ user: null, isLoading: false, error: null });
      // Server handles redirect, but we refresh to clear client state
      router.refresh();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false, error: 'Logout failed' }));
    }
  }, [router]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: !!state.user,
    login,
    signup,
    logout,
    refresh: fetchUser,
  };
}
