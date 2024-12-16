import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Surface } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    await register(email, password);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).springify()} 
          style={styles.header}
        >
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Sign up to get started</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()} 
          style={styles.form}
        >
          <Surface style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialIcons name="email" size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Surface>

          <Surface style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialIcons name="lock" size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </Surface>

          <Surface style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialIcons name="lock" size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </Surface>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.colors.onSurfaceVariant }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
