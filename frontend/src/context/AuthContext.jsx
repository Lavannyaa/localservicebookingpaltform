import React, { createContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

const initialState = {
  user: null,
  role: null, // 'customer' | 'provider' | 'admin'
  isAuthenticated: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, role: action.payload.role, isAuthenticated: true, loading: false };
    case 'REGISTER':
      return { ...state, user: action.payload.user, role: action.payload.role, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, role: null, isAuthenticated: false, loading: false };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'STOP_LOADING':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('lsb_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch({ type: 'LOGIN', payload: parsed });
    } else {
      dispatch({ type: 'STOP_LOADING' });
    }
  }, []);

  const login = async (email, password, role = 'customer') => {
    const data = await authService.login(email, password, role);
    localStorage.setItem('lsb_user', JSON.stringify({ user: data.user, role: data.role }));
    localStorage.setItem('lsb_token', data.token);
    dispatch({ type: 'LOGIN', payload: { user: data.user, role: data.role } });
    return data;
  };

  const register = async (formData, role = 'customer') => {
    const data = await authService.register(formData, role);
    localStorage.setItem('lsb_user', JSON.stringify({ user: data.user, role: data.role }));
    localStorage.setItem('lsb_token', data.token);
    dispatch({ type: 'REGISTER', payload: { user: data.user, role: data.role } });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('lsb_user');
    localStorage.removeItem('lsb_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data) => {
    const saved = JSON.parse(localStorage.getItem('lsb_user') || '{}');
    await authService.updateProfile(saved.user?.id, data);
    const updatedUser = { ...saved.user, ...data };
    localStorage.setItem('lsb_user', JSON.stringify({ ...saved, user: updatedUser }));
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
