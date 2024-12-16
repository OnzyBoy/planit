import { View, StyleSheet, Image } from 'react-native';
import { Text, Switch, List, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme, setSystemTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Image 
          source={require('../../assets/images/defaulticon.png')}
          style={styles.profileImage}
        />
        <Text style={[styles.email, { color: theme.colors.onSurface }]}>
          {user?.email}
        </Text>
      </Surface>

      <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="moon" />}
            right={() => (
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>
      </Surface>

      <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Sign Out"
            left={props => <List.Icon {...props} icon="logout" />}
            onPress={handleLogout}
          />
        </List.Section>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  email: {
    marginTop: 8,
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
  },
});
