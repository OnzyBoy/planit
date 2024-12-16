import React from 'react';
import { StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

export const ThemeToggle = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [spinAnim] = React.useState(new Animated.Value(0));

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePress = () => {
    Animated.spring(spinAnim, {
      toValue: isDark ? 0 : 1,
      useNativeDriver: true,
    }).start();
    toggleTheme();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? theme.colors.surfaceVariant
            : theme.colors.surface,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialIcons
          name={isDark ? 'dark-mode' : 'light-mode'}
          size={24}
          color={theme.colors.primary}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
