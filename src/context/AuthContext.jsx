import React, { createContext, useContext, useState, useEffect } from 'react';

const AUTH_API    = '/oauth/token';   // NOTE: no /api prefix — root-level OAuth endpoint
const PROFILE_API = '/api/agent_profiles';

/** Map API role_name → internal role key.
 *  Values come from profile.role_name — keep both legacy + current strings.
 */
const ROLE_MAP = {
  'Gramdoot'          : 'gramdoot',
  'ADA'               : 'ada',          // legacy — keep for safety
  'Asstt. da (block)' : 'ada',          // current API value for ADA role
  'SNO'               : 'sno',
  'Bank'              : 'bank',
};

/** Fallback resolver when role_name isn't in ROLE_MAP exactly */
function resolveRole(role_name) {
  if (!role_name) return 'gramdoot';
  const exact = ROLE_MAP[role_name];
  if (exact) return exact;
  // Partial / case-insensitive fallback
  const lower = role_name.toLowerCase();
  if (lower.includes('gramdoot'))                       return 'gramdoot';
  if (lower.includes('ada') || lower.includes('asstt')) return 'ada';
  if (lower.includes('sno'))                            return 'sno';
  if (lower.includes('bank'))                           return 'bank';
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
    if (msLeft <= 0) { logout(); return; }
    const timer = setTimeout(() => {
      console.warn('[AUTH] Token expired — logging out.');
      logout();
    }, msLeft);
    return () => clearTimeout(timer);
  }, [user]);

  /**
   * Authenticates against the real OAuth API, then fetches the agent profile
   * to get role, name, and working zone.
   */
  const login = async (email, password) => {
    const body = new FormData();
    body.append('username', email.trim());
    body.append('password', password);
    body.append('otp', '1234');
    body.append('grant_type', 'password');

    let tokenData;
    try {
      const res = await fetch(AUTH_API, { method: 'POST', body });
      tokenData = await res.json();

      console.log('[LOGIN] Status:', res.status, res.statusText);
      console.log('[LOGIN] Response:', tokenData);

      if (!res.ok) {
        // API returns error objects like { error: '...', error_description: '...' }
        const msg = tokenData?.error_description || tokenData?.error || 'Login failed.';
        console.warn('[LOGIN] Failed:', msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      console.error('[LOGIN] Network/Parse error:', err);
      return { success: false, message: 'Network error. Please try again.' };
    }

    const { access_token, token_type, expires_in, created_at } = tokenData;

    // Compute absolute expiry timestamp in ms
    const token_expires_at = (created_at + expires_in) * 1000;

    // ── Fetch real profile: role, name, working zone ──────────────────────────
    let role = 'gramdoot';
    let name = email.trim();
    let id   = null;
    let working_zone = null;
    try {
      const profileRes = await fetch(PROFILE_API, {
        headers: { 'Authorization': `Bearer ${access_token}` },
      });
      const profile = await profileRes.json();
      console.log('[LOGIN] Profile:', profile);
      role         = resolveRole(profile.role_name);
      name         = profile.name?.trim() || email.trim();
      id           = profile.id ?? null;  // needed as user_id when creating farmers
      // API returns 'working_zones' (plural array) for Gramdoot, 'working_zone' (singular) for others
      // Always take the first zone entry; fall back to singular field for backwards compat
      working_zone = (profile.working_zones ?? [])[0] ?? profile.working_zone ?? null;
    } catch (e) {
      console.warn('[LOGIN] Profile fetch failed, using defaults:', e);
    }

    const sessionUser = {
      id,               // server user PK — required when creating farmers (user_id field)
      email: email.trim(),
      name,
      role,
      working_zone,     // { id, district_id, block_id } — used to pre-fill forms
      access_token,
      token_type,
      expires_in,
      token_expires_at,
    };

    sessionStorage.setItem('portalUser', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true, user: sessionUser };
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
