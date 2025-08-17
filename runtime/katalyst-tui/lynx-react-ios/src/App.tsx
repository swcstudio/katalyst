import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

import { WasmProvider } from './providers/WasmProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { useIDEStore } from './stores/ideStore';

// Screens
import HomeScreen from './screens/HomeScreen';
import EditorScreen from './screens/EditorScreen';
import TerminalScreen from './screens/TerminalScreen';
import FileExplorerScreen from './screens/FileExplorerScreen';
import SettingsScreen from './screens/SettingsScreen';
import SandboxScreen from './screens/SandboxScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function App(): JSX.Element {
  const { initialize } = useIDEStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <WasmProvider>
            <ThemeProvider>
              <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#1e1e1e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Lynx IDE' }}
                  />
                  <Stack.Screen 
                    name="Editor" 
                    component={EditorScreen}
                    options={{ title: 'Code Editor' }}
                  />
                  <Stack.Screen 
                    name="Terminal" 
                    component={TerminalScreen}
                    options={{ title: 'Terminal' }}
                  />
                  <Stack.Screen 
                    name="FileExplorer" 
                    component={FileExplorerScreen}
                    options={{ title: 'Files' }}
                  />
                  <Stack.Screen 
                    name="Sandbox" 
                    component={SandboxScreen}
                    options={{ title: 'Sandbox Execution' }}
                  />
                  <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen}
                    options={{ title: 'Settings' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          </WasmProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;