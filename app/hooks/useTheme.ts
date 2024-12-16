import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';
import { RootState } from '../store';
import { setTheme } from '../store/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const { theme: storedTheme } = useSelector((state: RootState) => state.theme);

  const isDark = storedTheme === 'dark' || (storedTheme === 'system' && systemColorScheme === 'dark');
  const currentTheme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    dispatch(setTheme(isDark ? 'light' : 'dark'));
  };

  const setSystemTheme = () => {
    dispatch(setTheme('system'));
  };

  return {
    theme: currentTheme,
    isDark,
    toggleTheme,
    setSystemTheme,
  };
};

export default useTheme;
