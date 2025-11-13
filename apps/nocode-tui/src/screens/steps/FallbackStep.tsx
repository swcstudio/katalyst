import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';
import { SetupCard } from '../../components/SetupCard';

interface FallbackStepProps {
  onRetry: () => void;
  onManual: () => void;
}

export function FallbackStep({ onRetry, onManual }: FallbackStepProps) {
  const theme = useTheme();

  const handleRetry = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRetry();
  };

  const handleManual = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onManual();
  };

  return (
    <Animated.View 
      entering={FadeIn} 
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>⚠️</Text>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Setup Incomplete
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          We couldn't complete the automatic setup. Don't worry - you can still set up your connection manually or try again.
        </Text>
        
        <View style={styles.options}>
          <SetupCard
            icon="🔄"
            title="Try Again"
            description="Retry automatic detection and setup"
            onPress={handleRetry}
            recommended
          />
          
          <SetupCard
            icon="⚙️"
            title="Manual Setup"
            description="Configure your connection step by step"
            onPress={handleManual}
          />
        </View>
        
        <View style={styles.tips}>
          <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
            Common issues:
          </Text>
          <TipItem 
            text="SSH config file not found in expected location"
            theme={theme}
          />
          <TipItem 
            text="SSH keys are stored in a custom directory"
            theme={theme}
          />
          <TipItem 
            text="Network connectivity issues preventing connection test"
            theme={theme}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function TipItem({ text, theme }: { text: string; theme: any }) {
  return (
    <View style={styles.tipItem}>
      <Text style={[styles.tipBullet, { color: theme.colors.primary }]}>•</Text>
      <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
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
    marginBottom: 40,
  },
  options: {
    width: '100%',
    marginBottom: 40,
  },
  tips: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 8,
  },
  tipBullet: {
    marginRight: 8,
    marginTop: 2,
    fontSize: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});