import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { TerminalView } from '../components/TerminalView';
import { CommandPalette } from '../components/CommandPalette';
import { QuickActionsBar } from '../components/QuickActionsBar';
import { SessionTabs } from '../components/SessionTabs';
import { useTheme } from '../hooks/useTheme';
import { useTerminal } from '../hooks/useTerminal';
import { useKeyboard } from '../hooks/useKeyboard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function TerminalScreen({ route, navigation }: any) {
  const { sessionId } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const terminal = useTerminal();
  const keyboard = useKeyboard();
  
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [currentInput, setCurrentInput] = useState('');
  
  const terminalRef = useRef(null);
  const inputRef = useRef<TextInput>(null);
  
  const translateY = useSharedValue(0);

  // Swipe gesture to show/hide quick actions
  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        setShowQuickActions(!showQuickActions);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      translateY.value = withSpring(0);
    });

  const handleCommand = useCallback((command: string) => {
    terminal.sendCommand(sessionId, command);
    setCurrentInput('');
    setShowCommandPalette(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [sessionId]);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'tab':
        terminal.sendKey(sessionId, 'Tab');
        break;
      case 'esc':
        terminal.sendKey(sessionId, 'Escape');
        break;
      case 'ctrl-c':
        terminal.sendKey(sessionId, 'Ctrl+C');
        break;
      case 'up':
        terminal.sendKey(sessionId, 'ArrowUp');
        break;
      case 'down':
        terminal.sendKey(sessionId, 'ArrowDown');
        break;
      case 'paste':
        keyboard.paste((text) => {
          terminal.sendInput(sessionId, text);
        });
        break;
      case 'clear':
        terminal.clear(sessionId);
        break;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [sessionId]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Session Tabs */}
        <SessionTabs
          sessions={terminal.sessions}
          activeSessionId={sessionId}
          onSelectSession={(id) => navigation.setParams({ sessionId: id })}
          onNewSession={() => terminal.createSession()}
          onCloseSession={(id) => terminal.closeSession(id)}
        />

        {/* Terminal Content */}
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.terminalContainer, animatedContainerStyle]}>
            <TerminalView
              ref={terminalRef}
              sessionId={sessionId}
              onTap={() => inputRef.current?.focus()}
            />
          </Animated.View>
        </GestureDetector>

        {/* Quick Actions Bar */}
        {showQuickActions && (
          <Animated.View
            entering={SlideInDown.springify()}
            exiting={SlideOutDown.springify()}
            style={styles.quickActionsContainer}
          >
            <BlurView intensity={90} tint="dark" style={styles.quickActionsBlur}>
              <QuickActionsBar onAction={handleQuickAction} />
            </BlurView>
          </Animated.View>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          <BlurView intensity={100} tint="dark" style={styles.inputBlur}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={[styles.input, { color: theme.colors.text }]}
                value={currentInput}
                onChangeText={setCurrentInput}
                onSubmitEditing={() => {
                  if (currentInput.trim()) {
                    handleCommand(currentInput);
                  }
                }}
                placeholder="Type command or tap terminal..."
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.commandButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowCommandPalette(true)}
              >
                <Text style={styles.commandButtonText}>⌘</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Command Palette */}
        {showCommandPalette && (
          <CommandPalette
            visible={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onSelectCommand={handleCommand}
            recentCommands={terminal.getRecentCommands(sessionId)}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  terminalContainer: {
    flex: 1,
  },
  quickActionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
  },
  quickActionsBlur: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputBlur: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  commandButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  commandButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});