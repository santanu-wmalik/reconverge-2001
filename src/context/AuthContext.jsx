import { createContext, useContext, useReducer, useEffect } from 'react';
import { alumniApi, userApi } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.role === 'admin',
      };
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
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

  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    try {
      // Step 1: Validate credentials against users table
      const users = await userApi.getByEmail(email);
      if (users.length === 0) {
        return { success: false, error: 'No account found with this email' };
      }

      const userRecord = users[0];
      if (userRecord.password !== password) {
        return { success: false, error: 'Invalid password. Please try again.' };
      }

      // Step 2: Fetch the full alumni profile
      const alumni = await alumniApi.getByEmail(email);
      if (alumni.length === 0) {
        return { success: false, error: 'Alumni profile not found' };
      }

      // Step 3: Use role from users table (authoritative source)
      const user = { ...alumni[0], role: userRecord.role };
      dispatch({ type: 'LOGIN', payload: user });
      return { success: true, user };
    } catch {
      return { success: false, error: 'Server unavailable. Please try again.' };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
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

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
