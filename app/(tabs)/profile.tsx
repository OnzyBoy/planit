import { View, StyleSheet, Image } from 'react-native';
import { Text, Switch, List, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const moonIcon = require('../../assets/images/moonicon.png');
const sunIcon = require('../../assets/images/sunicon.png');

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
            title=""
            left={() => (
              <View style={styles.iconContainer}>
                <Image source={isDark ? sunIcon : moonIcon} style={styles.icon} />
                <Text style={[styles.darkModeText, { color: theme.colors.onSurface }]}>Dark Mode</Text>
              </View>
            )}
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
    paddingTop: 40,
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  darkModeText: {
    fontSize: 16,
  },
});
