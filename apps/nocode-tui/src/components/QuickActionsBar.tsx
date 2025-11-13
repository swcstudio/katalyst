import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';

interface QuickActionsBarProps {
  onAction: (action: string) => void;
}

const actions = [
  { id: 'tab', label: 'Tab', icon: '⇥' },
  { id: 'esc', label: 'Esc', icon: '⎋' },
  { id: 'ctrl-c', label: 'Ctrl+C', icon: '^C' },
  { id: 'up', label: '↑', icon: '↑' },
  { id: 'down', label: '↓', icon: '↓' },
  { id: 'left', label: '←', icon: '←' },
  { id: 'right', label: '→', icon: '→' },
  { id: 'paste', label: 'Paste', icon: '📋' },
  { id: 'clear', label: 'Clear', icon: '🗑' },
  { id: 'yes', label: 'Yes', icon: 'Y' },
  { id: 'no', label: 'No', icon: 'N' },
];

export function QuickActionsBar({ onAction }: QuickActionsBarProps) {
  const theme = useTheme();

  const handlePress = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Special handling for yes/no
    if (action === 'yes') {
      onAction('input:y\n');
    } else if (action === 'no') {
      onAction('input:n\n');
    } else {
      onAction(action);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[styles.button, { backgroundColor: theme.colors.surface }]}
          onPress={() => handlePress(action.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.icon, { color: theme.colors.primary }]}>
            {action.icon}
          </Text>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 60,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});