import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="home">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />

        <Stack.Screen name="movie-details/[id]" options={{ headerTitle: 'Movie Details' }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="details" options={{ presentation: 'modal', headerTitle: 'Details' }} />
        <Stack.Screen
          name="player"
          options={{
            title: 'Player',
            headerStyle: {
              backgroundColor: 'black', // Header background color
            },
            headerTintColor: 'white', // Back arrow color
            headerTitleStyle: {
              color: 'white', // Title color
              fontSize: 18,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
