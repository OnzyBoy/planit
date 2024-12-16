import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Surface } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    await login(email, password);
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
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Sign in to continue</Text>
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

          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Sign In</Text>
            )}
          </TouchableOpacity>

          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.colors.onSurfaceVariant }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                Sign Up
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
