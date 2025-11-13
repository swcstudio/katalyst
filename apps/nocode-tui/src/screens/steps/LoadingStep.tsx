import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, { 
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { useTheme } from '../../hooks/useTheme';

export function LoadingStep() {
  const theme = useTheme();
  
  // Animated pulse for the loading indicator
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );
  }, []);
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeIn} 
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.loadingIcon, pulseStyle]}>
          <Text style={styles.emoji}>🚀</Text>
        </Animated.View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Setting up your connection
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          We're importing your SSH configurations and testing connections...
        </Text>
        
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
          style={styles.spinner}
        />
        
        <View style={styles.steps}>
          <LoadingStepItem 
            text="Detecting SSH configurations" 
            completed={true}
            theme={theme}
          />
          <LoadingStepItem 
            text="Importing SSH keys" 
            completed={true}
            theme={theme}
          />
          <LoadingStepItem 
            text="Testing connections" 
            completed={false}
            theme={theme}
          />
          <LoadingStepItem 
            text="Finalizing setup" 
            completed={false}
            theme={theme}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function LoadingStepItem({ 
  text, 
  completed, 
  theme 
}: { 
  text: string; 
  completed: boolean; 
  theme: any; 
}) {
  return (
    <View style={styles.stepItem}>
      <View style={[
        styles.stepIndicator,
        {
          backgroundColor: completed 
            ? theme.colors.success
            : theme.colors.surface,
        }
      ]}>
        {completed ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        )}
      </View>
      <Text style={[
        styles.stepText,
        {
          color: completed 
            ? theme.colors.text 
            : theme.colors.textSecondary,
        }
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  loadingIcon: {
    marginBottom: 32,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 40,
  },
  steps: {
    width: '100%',
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    flex: 1,
  },
});