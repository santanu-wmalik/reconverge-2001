import { createContext, useContext, useReducer, useEffect } from 'react';
import { alumniApi } from '../services/api';

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

  const login = async (email, role = 'alumni') => {
    try {
      const results = await alumniApi.getByEmail(email);
      if (results.length > 0) {
        const user = { ...results[0], role: results[0].role || role };
        dispatch({ type: 'LOGIN', payload: user });
        return { success: true, user };
      }
      return { success: false, error: 'No account found with this email' };
    } catch {
      // Fallback: try localStorage cache
      const saved = localStorage.getItem('alumni-auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user?.email === email) {
          dispatch({ type: 'LOGIN', payload: { ...parsed.user, role } });
          return { success: true, user: parsed.user };
        }
      }
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
