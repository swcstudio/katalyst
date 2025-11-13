import React from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from './providers/ThemeProvider';
import { TerminalProvider } from './providers/TerminalProvider';
import { ConnectionProvider } from './providers/ConnectionProvider';
import { HapticsProvider } from './providers/HapticsProvider';

import { RootNavigator } from './navigation/RootNavigator';
import { useAppStore } from './stores/appStore';

/**
 * NoCode TUI - Beautiful mobile-first terminal
 * Built with Lynx family framework for optimal performance
 */
function App() {
  const { initialized } = useAppStore();

  React.useEffect(() => {
    // Initialize app
    useAppStore.getState().initialize();
  }, []);

  if (!initialized) {
    // Show splash screen while initializing
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <HapticsProvider>
            <ConnectionProvider>
              <TerminalProvider>
                <NavigationContainer>
                  <StatusBar style="light" />
                  <RootNavigator />
                </NavigationContainer>
              </TerminalProvider>
            </ConnectionProvider>
          </HapticsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Register the app for Expo
registerRootComponent(App);

export default App;