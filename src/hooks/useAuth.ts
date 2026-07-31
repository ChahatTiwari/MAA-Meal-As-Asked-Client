// hooks/useAuth.ts
import { useAppSelector, useAppDispatch } from './redux';
import { login, signup, logout, checkAuthState, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  return {
    user,
    isLoading,
    error,
    login: (email: string, password: string) => dispatch(login({ email, password })).unwrap(),
    signup: (email: string, password: string, name: string) =>
      dispatch(signup({ email, password, name })).unwrap(),
    logout: () => dispatch(logout()).unwrap(),
    checkAuthState: () => dispatch(checkAuthState()).unwrap(),
    clearError: () => dispatch(clearError()),
  };
};
