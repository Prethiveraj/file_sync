import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as FileSystem from 'expo-file-system';
import { AppStateContext } from '@/contexts/AppStateContext';
import Colors from '@/constants/Colors';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  // Setup app state
  const [isLoading, setIsLoading] = useState(true);
  const [appDirectory, setAppDirectory] = useState<string | null>(null);

  // This hook is required for the framework to function properly
  useFrameworkReady();

  // Create the app directory if it doesn't exist
  const initializeAppDirectory = useCallback(async () => {
    try {
      // Only works on native platforms
      if (FileSystem.documentDirectory) {
        const directory = `${FileSystem.documentDirectory}files/`;
        const dirInfo = await FileSystem.getInfoAsync(directory);
        
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        }
        
        setAppDirectory(directory);
      } else {
        // Web implementation
        setAppDirectory('web-storage');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize app directory:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAppDirectory();
  }, [initializeAppDirectory]);

  // Show splash screen while fonts are loading and app is initializing
  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  // Return null to keep splash screen visible while loading
  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <AppStateContext.Provider value={{ appDirectory }}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
        },
        contentStyle: {
          backgroundColor: Colors.backgroundDark,
        },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="file/[id]" options={{ 
          title: 'File Details',
          presentation: 'modal',
        }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="auto" />
    </AppStateContext.Provider>
  );
}