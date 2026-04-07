import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearAuthTokens, getAccessToken, setAuthTokens } from '../api/client';

const AUTH_API = '/api/v1/login';

const ROLE_MAP = {
  Gramdoot: 'gramdoot',
  ADA: 'ada',
  DDA: 'dda',
  'Dda (admin)': 'dda',
  'Asstt. da (block)': 'ada',
  SNO: 'sno',
  Bank: 'bank',
  Admin: 'admin',
};

function resolveRole(role_name) {
  if (!role_name) return 'gramdoot';
  const exact = ROLE_MAP[role_name];
  if (exact) return exact;

  const lower = role_name.toLowerCase();
  if (lower.includes('gramdoot')) return 'gramdoot';
  if (lower.includes('dda')) return 'dda';
  if (lower.includes('ada') || lower.includes('asstt')) return 'ada';
  if (lower.includes('sno')) return 'sno';
  if (lower.includes('bank')) return 'bank';
  if (lower.includes('admin')) return 'admin';

  console.warn('[AUTH] Unknown role_name:', role_name, '- defaulting to gramdoot');
  return 'gramdoot';
}

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('km_applicants');

    const stored = sessionStorage.getItem('portalUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!parsed.token_expires_at || Date.now() < parsed.token_expires_at || parsed.refresh_token) {
        setAuthTokens({
          accessToken: parsed.access_token || null,
          refreshToken: parsed.refresh_token || null,
        });
        setUser(parsed);
      } else {
        clearAuthTokens();
        sessionStorage.removeItem('portalUser');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.token_expires_at) return;

    const msLeft = user.token_expires_at - Date.now();

    if (msLeft <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      console.warn('[AUTH] Token expired - logging out.');
      logout();
    }, msLeft);

    return () => clearTimeout(timer);
  }, [user]);

  const login = async (email, password) => {
    const body = JSON.stringify({
      auth: {
        email: email.trim(),
        password,
      },
    });

    let resultData;
    try {
      const res = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      resultData = await res.json();

      console.log('[LOGIN] Status:', res.status, res.statusText);
      console.log('[LOGIN] Response:', resultData);

      if (!res.ok || !resultData.data?.access_token) {
        const msg = resultData?.message || resultData?.error || resultData?.data?.message || 'Login failed.';
        console.warn('[LOGIN] Failed:', msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      console.error('[LOGIN] Network/Parse error:', err);
      return { success: false, message: 'Network error. Please try again.' };
    }

    const { access_token, refresh_token, user: userData } = resultData.data;

    let token_expires_at = null;
    try {
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      if (payload.exp) token_expires_at = payload.exp * 1000;
    } catch (e) {
      console.warn('Failed to parse token expiration', e);
    }

    const role = resolveRole(userData.role_name);
    const name = userData.name?.trim() || email.trim();
    const id = userData.id ?? null;
    const working_zone = (userData.working_zones ?? [])[0] ?? userData.working_zone ?? null;

    const sessionUser = {
      id,
      email: userData.email?.trim() || email.trim(),
      name,
      role,
      working_zone,
      access_token,
      refresh_token,
      token_type: 'Bearer',
      token_expires_at,
    };

    setAuthTokens({ accessToken: access_token, refreshToken: refresh_token });
    sessionStorage.setItem('portalUser', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  const logout = async () => {
    const token = getAccessToken();

    if (token) {
      try {
        await fetch('/api/v1/logout', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.warn('[AUTH] Logout API failed:', err);
      }
    }

    clearAuthTokens();
    sessionStorage.removeItem('portalUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
