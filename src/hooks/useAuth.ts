// hooks/useAuth.ts
// Authentication hook with typed selectors and actions

import { useAppDispatch, useAppSelector } from './redux';
import { 
  login, 
  signup, 
  logout, 
  checkAuthState, 
  updateProfile,
  clearError 
} from '../store/slices/authSlice';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { 
    user, 
    isLoading, 
    error, 
    role, 
    isAuthenticated 
  } = useAppSelector((state) => state.auth);

  return {
    user,
    isLoading,
    error,
    role,
    isAuthenticated,
    isCook: role === 'cook',
    isCustomer: role === 'customer',
    login: (email: string, password: string) => 
      dispatch(login({ email, password })).unwrap(),
    signup: (email: string, password: string, name: string) =>
      dispatch(signup({ email, password, name })).unwrap(),
    logout: () => dispatch(logout()).unwrap(),
    checkAuthState: () => dispatch(checkAuthState()).unwrap(),
    updateProfile: (data: Partial<User>) => 
      dispatch(updateProfile(data)).unwrap(),
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;