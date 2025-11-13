import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

import { useTheme } from '../hooks/useTheme';
import { useTerminal } from '../hooks/useTerminal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TerminalViewProps {
  sessionId: string;
  onTap?: () => void;
}

export const TerminalView = forwardRef<any, TerminalViewProps>(
  ({ sessionId, onTap }, ref) => {
    const theme = useTheme();
    const terminal = useTerminal();
    const scrollViewRef = useRef<ScrollView>(null);
    
    const session = terminal.getSession(sessionId);
    const cursorOpacity = useSharedValue(1);

    useEffect(() => {
      // Cursor blink animation
      const interval = setInterval(() => {
        cursorOpacity.value = withSpring(cursorOpacity.value === 1 ? 0 : 1);
      }, 500);
      
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      // Auto-scroll to bottom when new content
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [session?.output]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        onTap?.();
      },
      clear: () => {
        terminal.clear(sessionId);
      },
    }));

    const cursorStyle = useAnimatedStyle(() => ({
      opacity: cursorOpacity.value,
    }));

    if (!session) {
      return (
        <View style={[styles.container, { backgroundColor: theme.colors.terminal }]}>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Initializing session...
          </Text>
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={onTap}>
        <View style={[styles.container, { backgroundColor: theme.colors.terminal }]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {session.output.map((line, index) => (
              <Animated.View
                key={`${index}-${line.id}`}
                entering={FadeIn.duration(200)}
                style={styles.line}
              >
                {line.type === 'prompt' && (
                  <Text style={[styles.prompt, { color: theme.colors.primary }]}>
                    {line.prompt || '$ '}
                  </Text>
                )}
                <Text
                  style={[
                    styles.text,
                    {
                      color: line.color || theme.colors.text,
                      fontWeight: line.bold ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {line.text}
                </Text>
              </Animated.View>
            ))}
            
            {/* Current input line with cursor */}
            <View style={styles.inputLine}>
              <Text style={[styles.prompt, { color: theme.colors.primary }]}>
                {session.prompt || '$ '}
              </Text>
              <Text style={[styles.text, { color: theme.colors.text }]}>
                {session.currentInput}
              </Text>
              <Animated.View style={[styles.cursor, cursorStyle]} />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  line: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  inputLine: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
  },
  prompt: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  cursor: {
    width: 8,
    height: 16,
    backgroundColor: '#00ff00',
    marginLeft: 2,
  },
});