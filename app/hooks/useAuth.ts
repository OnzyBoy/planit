import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/index';
import { setUser, setLoading, setError, logout } from '../store/authSlice';
import { loginUser, registerUser, logoutUser, subscribeToAuthChanges } from '../services/firebase';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { user, error } = await loginUser(email, password);
      if (error) {
        dispatch(setError(error));
      } else {
        dispatch(setUser(user));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { user, error } = await registerUser(email, password);
      if (error) {
        dispatch(setError(error));
      } else {
        dispatch(setUser(user));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signOut = async () => {
    try {
      dispatch(setLoading(true));
      const { error } = await logoutUser();
      if (error) {
        dispatch(setError(error));
      } else {
        dispatch(logout());
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    signOut,
  };
};

export default useAuth;
