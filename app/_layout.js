import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { isAuthenticated } from '../services/authService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      const inAuthGroup = segments[0] === '(auth)';

      if (!authenticated && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (authenticated && inAuthGroup) {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
