import { Stack } from 'expo-router';

import { AuthProvider } from '../src/providers/AuthProvider';
import { NetworkProvider } from '../src/providers/NetworkProvider';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { GluestackUIProvider } from '@gluestack-ui/provider';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider>
        <NetworkProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
