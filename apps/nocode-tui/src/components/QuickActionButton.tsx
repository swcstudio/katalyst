import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_SIZE = (SCREEN_WIDTH - 60) / 2;

interface QuickActionButtonProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

const icons: Record<string, string> = {
  terminal: '⌨️',
  server: '🖥️',
  key: '🔑',
  folder: '📁',
  plus: '➕',
  search: '🔍',
  settings: '⚙️',
  cloud: '☁️',
};

export function QuickActionButton({ icon, label, color, onPress }: QuickActionButtonProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color + '15' }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '25' }]}>
          <Text style={styles.icon}>{icons[icon] || '📱'}</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE * 0.9,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});