import { createContext, useContext, useReducer, useEffect } from 'react';
import { alumniApi, authApi, getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  // Impersonation: when a super-admin "Views as" another user, we still want
  // to know they originally were super-admin so the banner + Stop button
  // render. The flag flips via the LOGIN action's optional `impersonating`.
  impersonating: false,
};

// Role semantics:
//   'alumni'       → regular portal only
//   'admin'        → regular portal + admin portal
//   'super-admin'  → regular portal + admin portal + User Management
function deriveFlags(role) {
  return {
    isAdmin: role === 'admin' || role === 'super-admin',
    isSuperAdmin: role === 'super-admin',
  };
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        isAuthenticated: true,
        impersonating: false,
        ...deriveFlags(action.payload.role),
      };
    case 'IMPERSONATE':
      return {
        user: action.payload,
        isAuthenticated: true,
        impersonating: true,
        ...deriveFlags(action.payload.role),
      };
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'UPDATE_ROLE': {
      const nextUser = { ...state.user, role: action.payload };
      return {
        ...state,
        user: nextUser,
        ...deriveFlags(action.payload),
      };
    }
    default:
      return state;
  }
}

// Cookie helpers
function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
}

export function getSavedCredentials() {
  const email = getCookie('alumni_email');
  const password = getCookie('alumni_password');
  return (email && password) ? { email, password } : null;
}

export function saveCredentials(email, password) {
  setCookie('alumni_email', email);
  setCookie('alumni_password', password);
}

export function clearSavedCredentials() {
  deleteCookie('alumni_email');
  deleteCookie('alumni_password');
}

function loadState() {
  try {
    const saved = localStorage.getItem('alumni-auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.user) return parsed;
    }
  } catch {
    // ignore
  }
  return initialState;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, null, loadState);

  useEffect(() => {
    localStorage.setItem('alumni-auth', JSON.stringify(state));
  }, [state]);

  // Migration / sanity check: if we have a "logged in" user from before the
  // token-auth migration (or after a server restart that flushed the in-memory
  // token table), every API call would 401 silently. Verify the token at
  // boot and if it's stale, drop the session so the UI prompts a re-login.
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const token = getAuthToken();
    if (!token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }
    authApi.me().catch((err) => {
      if (err?.status === 401) {
        setAuthToken(null);
        dispatch({ type: 'LOGOUT' });
      }
    });
    // Run once at mount; we don't want this to refire on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    try {
      // Server-side validation: passwords no longer travel back to the client.
      // The endpoint returns { user, token } on success. The token is what
      // every subsequent /api/* request authenticates with.
      const { user, token } = await authApi.login(email, password);
      setAuthToken(token);
      dispatch({ type: 'LOGIN', payload: user });
      return { success: true, user };
    } catch (err) {
      if (err?.status === 401) {
        return { success: false, error: 'Invalid email or password' };
      }
      return { success: false, error: 'Server unavailable. Please try again.' };
    }
  };

  const logout = () => {
    // Best-effort server invalidation — don't block UI on it.
    authApi.logout().catch(() => {});
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Super-admin only. The server enforces — the UI just provides the entry
  // point. On success we swap our token + user so every subsequent request
  // is "as" the target user. We deliberately keep the React state shape
  // unchanged (same `user` object), only flipping `impersonating: true`,
  // so the rest of the app behaves identically to a real session.
  const impersonate = async (targetUserId) => {
    try {
      const { user, token } = await authApi.impersonate(targetUserId);
      setAuthToken(token);
      dispatch({ type: 'IMPERSONATE', payload: user });
      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        error: err?.status === 403 ? 'Super-admin access required' : 'Could not impersonate.',
      };
    }
  };

  const stopImpersonating = async () => {
    try {
      const { user, token } = await authApi.stopImpersonating();
      setAuthToken(token);
      // LOGIN action — clears the impersonating flag and re-derives super-admin
      // flags from the original role.
      dispatch({ type: 'LOGIN', payload: user });
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Could not stop impersonating. Please log in again.' };
    }
  };

  const updateProfile = async (data) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
    if (state.user?.id) {
      try {
        await alumniApi.update(state.user.id, data);
      } catch (error) {
        console.error('Failed to sync profile update to server:', error);
      }
    }
  };

  // Fine-grained capability check. Super-admin trumps everything; otherwise
  // the truth is `user.permissions[name]`. Keeps callers from repeating the
  // `role === 'super-admin' || …` incantation everywhere.
  const hasPermission = (name) => {
    if (!state.user) return false;
    if (state.isSuperAdmin) return true;
    return Boolean(state.user.permissions && state.user.permissions[name]);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateProfile, impersonate, stopImpersonating, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
