import { MD3LightTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

export const lightColors = {
  primary: '#6200EE',
  primaryContainer: '#BB86FC',
  secondary: '#03DAC6',
  secondaryContainer: '#018786',
  background: '#F6F6F6',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F3F3',
  error: '#FF3B30',
  errorContainer: '#FFEBEE',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#000000',
  onSecondary: '#000000',
  onSecondaryContainer: '#FFFFFF',
  onBackground: '#000000',
  onSurface: '#000000',
  onSurfaceVariant: '#000000',
  onError: '#FFFFFF',
  onErrorContainer: '#991B1B',
  outline: '#79747E',
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',
    level2: '#F6F6F6',
    level3: '#F3F3F3',
    level4: '#F0F0F0',
    level5: '#EDEDED',
  },
  // Custom colors for our app
  taskCard: '#FFFFFF',
  taskCardBorder: '#E5E5EA',
  taskPriority: {
    high: '#FF3B30',
    medium: '#FF9500',
    low: '#34C759',
  },
  taskStatus: {
    completed: '#34C759',
    inProgress: '#007AFF',
    pending: '#FF9500',
  },
  chart: {
    primary: '#007AFF',
    secondary: '#5856D6',
    tertiary: '#34C759',
    quaternary: '#FF9500',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export const navigationLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.surface,
    text: lightColors.onSurface,
    border: lightColors.outline,
    notification: lightColors.error,
  },
};

export default lightTheme;
