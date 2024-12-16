import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store } from './store/index';
import { subscribeToAuthChanges } from './services/firebase';
import { setUser } from './store/authSlice';
import { useTheme } from './hooks/useTheme';

function RootLayoutNav() {
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      store.dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
