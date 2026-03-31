import React, { createContext, useContext, useState, useEffect } from 'react';

const AUTH_API = '/api/v1/login';

/** Map API role_name → internal role key.
 *  Values come from profile.role_name — keep both legacy + current strings.
 */
const ROLE_MAP = {
  'Gramdoot': 'gramdoot',
  'ADA': 'ada',          // legacy — keep for safety
  'Asstt. da (block)': 'ada',          // current API value for ADA role
  'SNO': 'sno',
  'Bank': 'bank',
  'Admin': 'admin',
};

/** Fallback resolver when role_name isn't in ROLE_MAP exactly */
function resolveRole(role_name) {
  if (!role_name) return 'gramdoot';
  const exact = ROLE_MAP[role_name];
  if (exact) return exact;
  // Partial / case-insensitive fallback
  const lower = role_name.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('gramdoot')) return 'gramdoot';
  if (lower.includes('ada') || lower.includes('asstt')) return 'ada';
  if (lower.includes('sno')) return 'sno';
  if (lower.includes('bank')) return 'bank';
  console.warn('[AUTH] Unknown role_name:', role_name, '— defaulting to gramdoot');
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
    const stored = sessionStorage.getItem('portalUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if token is still valid (token_expires_at is stored as ms timestamp)
      if (parsed.token_expires_at && Date.now() < parsed.token_expires_at) {
        setUser(parsed);
      } else {
        // Token expired — clear session and force re-login
        sessionStorage.removeItem('portalUser');
      }
    }
    setLoading(false);
  }, []);

  // Auto-logout when token expires mid-session
  useEffect(() => {
    if (!user?.token_expires_at) return;
    const msLeft = user.token_expires_at - Date.now();

    // If we have a refresh token, let the api client handle the 401
    // We only force logout if there's no refresh token OR if it's been a very long time
    if (msLeft <= 0) {
      if (!user.refresh_token) {
        logout();
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!user.refresh_token) {
        console.warn('[AUTH] Token expired — logging out.');
        logout();
      }
    }, msLeft);

    return () => clearTimeout(timer);
  }, [user]);

  /**
   * Authenticates against the new /api/v1/login API and handles response
   */
  const login = async (email, password) => {
    const body = JSON.stringify({
      auth: {
        email: email.trim(),
        password: password
      }
    });

    let resultData;
    try {
      const res = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      resultData = await res.json();

      console.log('[LOGIN] Status:', res.status, res.statusText);
      console.log('[LOGIN] Response:', resultData);

      if (!res.ok || !resultData.data?.access_token) {
        // API returns error objects
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
      console.warn("Failed to parse token expiration", e);
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

    sessionStorage.setItem('portalUser', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  const logout = async () => {
    const token = user?.access_token || JSON.parse(sessionStorage.getItem('portalUser') || '{}')?.access_token;

    if (token) {
      try {
        await fetch('/api/v1/logout', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.warn('[AUTH] Logout API failed:', err);
      }
    }

    sessionStorage.removeItem('portalUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
