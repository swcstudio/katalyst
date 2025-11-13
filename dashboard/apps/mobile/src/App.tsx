import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, Platform } from 'react-native';
import { GluestackUIProvider } from '@gluestack-ui/provider';
import { config } from '@gluestack-ui/config';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { NetworkProvider } from '@/providers/NetworkProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={config}>
            <ThemeProvider>
              <NetworkProvider>
                <AuthProvider>
                  <StatusBar 
                    barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
                    backgroundColor="#1a1a1a"
                    translucent={false}
                  />
                  {/* Expo Router will handle navigation here */}
                </AuthProvider>
              </NetworkProvider>
            </ThemeProvider>
          </GluestackUIProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
