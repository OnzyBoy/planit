import { MD3DarkTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    onPrimary: '#000000',
    primaryContainer: '#3700B3',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#03DAC6',
    onSecondary: '#000000',
    secondaryContainer: '#018786',
    onSecondaryContainer: '#FFFFFF',
    background: '#121212',
    onBackground: '#FFFFFF',
    surface: '#121212',
    onSurface: '#FFFFFF',
    surfaceVariant: '#1F1F1F',
    onSurfaceVariant: '#FFFFFF',
    outline: '#938F99',
    elevation: {
      level0: 'transparent',
      level1: '#1F1F1F',
      level2: '#232323',
      level3: '#252525',
      level4: '#272727',
      level5: '#2A2A2A',
    },
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export const navigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: darkTheme.colors.primary,
    background: darkTheme.colors.background,
    card: darkTheme.colors.surface,
    text: darkTheme.colors.onSurface,
    border: darkTheme.colors.outline,
    notification: darkTheme.colors.error,
  },
};

export default darkTheme;
