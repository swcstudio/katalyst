import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { useTheme } from '../hooks/useTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  onSelectCommand: (command: string) => void;
  recentCommands?: string[];
}

const commonCommands = [
  { command: 'ls -la', description: 'List files with details' },
  { command: 'cd', description: 'Change directory' },
  { command: 'pwd', description: 'Print working directory' },
  { command: 'mkdir', description: 'Create directory' },
  { command: 'rm -rf', description: 'Remove files/directories' },
  { command: 'cp', description: 'Copy files' },
  { command: 'mv', description: 'Move/rename files' },
  { command: 'cat', description: 'Display file content' },
  { command: 'grep', description: 'Search in files' },
  { command: 'find', description: 'Find files' },
  { command: 'ps aux', description: 'List processes' },
  { command: 'top', description: 'Show system processes' },
  { command: 'kill', description: 'Terminate process' },
  { command: 'chmod', description: 'Change permissions' },
  { command: 'sudo', description: 'Run as superuser' },
  { command: 'ssh', description: 'Connect to remote server' },
  { command: 'scp', description: 'Copy files over SSH' },
  { command: 'git status', description: 'Git repository status' },
  { command: 'git add .', description: 'Stage all changes' },
  { command: 'git commit -m', description: 'Commit with message' },
  { command: 'git push', description: 'Push to remote' },
  { command: 'git pull', description: 'Pull from remote' },
  { command: 'npm install', description: 'Install npm packages' },
  { command: 'npm run', description: 'Run npm script' },
  { command: 'docker ps', description: 'List Docker containers' },
  { command: 'docker run', description: 'Run Docker container' },
];

export function CommandPalette({ 
  visible, 
  onClose, 
  onSelectCommand,
  recentCommands = [] 
}: CommandPaletteProps) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [filteredCommands, setFilteredCommands] = useState(commonCommands);
  
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  useEffect(() => {
    if (!searchText.trim()) {
      // Show recent commands first, then common commands
      const combined = [
        ...recentCommands.map(cmd => ({ command: cmd, description: 'Recent command' })),
        ...commonCommands,
      ];
      setFilteredCommands(combined.slice(0, 15));
    } else {
      const filtered = commonCommands.filter(
        item =>
          item.command.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCommands(filtered.slice(0, 10));
    }
  }, [searchText, recentCommands]);

  const handleSelectCommand = (command: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectCommand(command);
    setSearchText('');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView intensity={50} tint="dark" style={styles.blur}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <BlurView intensity={100} tint="dark" style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={[styles.title, { color: theme.colors.text }]}>
                    Command Palette
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <TextInput
                  style={[styles.searchInput, { 
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surface,
                  }]}
                  placeholder="Type a command..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    if (filteredCommands.length > 0) {
                      handleSelectCommand(filteredCommands[0].command);
                    }
                  }}
                />

                {/* Commands List */}
                <FlatList
                  data={filteredCommands}
                  keyExtractor={(item, index) => `${item.command}-${index}`}
                  renderItem={({ item, index }) => (
                    <Animated.View entering={FadeIn.delay(index * 50)}>
                      <TouchableOpacity
                        style={[styles.commandItem, { backgroundColor: theme.colors.surface + '50' }]}
                        onPress={() => handleSelectCommand(item.command)}
                      >
                        <View style={styles.commandContent}>
                          <Text style={[styles.commandText, { color: theme.colors.text }]}>
                            {item.command}
                          </Text>
                          <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
                            {item.description}
                          </Text>
                        </View>
                        <Text style={[styles.arrow, { color: theme.colors.primary }]}>
                          →
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  style={styles.commandsList}
                  showsVerticalScrollIndicator={false}
                />

                {/* Quick Action */}
                <TouchableOpacity
                  style={[styles.quickAction, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleSelectCommand(searchText)}
                >
                  <Text style={styles.quickActionText}>
                    Execute "{searchText || 'command'}"
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - 40,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  content: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  commandsList: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },
  commandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  commandContent: {
    flex: 1,
  },
  commandText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickAction: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});