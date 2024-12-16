import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from '../components/ThemeToggle';

export default function AuthLayout() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={[styles.themeToggleContainer, { backgroundColor: theme.colors.background }]}>
        <ThemeToggle />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1000,
    padding: 4,
    borderRadius: 24,
  },
});