import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
          backgroundColor: theme.colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}