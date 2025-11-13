import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { 
  SlideInRight, 
  SlideOutLeft,
  FadeIn,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';
import { SSHConfig } from '../../hooks/useSSHSetup';
import { terminalBridge } from '../../services/TerminalBridge';

interface QuickConnectStepProps {
  configs: SSHConfig[];
  onConnected: (sessionId: string) => void;
  onBack: () => void;
}

interface ConnectionStatus {
  configId: string;
  status: 'idle' | 'connecting' | 'connected' | 'failed';
  sessionId?: string;
  error?: string;
}

export function QuickConnectStep({ 
  configs, 
  onConnected, 
  onBack 
}: QuickConnectStepProps) {
  const theme = useTheme();
  const [connectionStates, setConnectionStates] = useState<ConnectionStatus[]>(
    configs.map(config => ({
      configId: config.id,
      status: 'idle',
    }))
  );

  const handleConnect = async (config: SSHConfig): Promise<void> => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Update connection state to connecting
      setConnectionStates(prev => prev.map(state => 
        state.configId === config.id 
          ? { ...state, status: 'connecting', error: undefined }
          : state
      ));

      // Prepare connection config
      const connectionConfig = {
        id: config.id,
        name: config.name || `${config.user}@${config.hostname}`,
        host: config.hostname,
        port: config.port,
        user: config.user,
        keyPath: config.keyPath,
        workingDirectory: '~',
      };

      // Attempt connection
      const sessionId = await terminalBridge.connectToServer(connectionConfig);

      // Success
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setConnectionStates(prev => prev.map(state => 
        state.configId === config.id 
          ? { ...state, status: 'connected', sessionId }
          : state
      ));

      // Navigate to terminal after short delay
      setTimeout(() => {
        onConnected(sessionId);
      }, 1500);

    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      setConnectionStates(prev => prev.map(state => 
        state.configId === config.id 
          ? { 
              ...state, 
              status: 'failed', 
              error: error.message || 'Connection failed'
            }
          : state
      ));

      Alert.alert(
        'Connection Failed',
        error.message || 'Failed to connect to the server. Please check your configuration and try again.',
        [
          { text: 'OK', style: 'default' },
          { 
            text: 'Retry', 
            onPress: () => handleConnect(config),
            style: 'default',
          },
        ]
      );
    }
  };

  const handleConnectAll = async (): Promise<void> => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      // Connect to all servers sequentially
      for (const config of configs) {
        const state = connectionStates.find(s => s.configId === config.id);
        if (state?.status === 'idle' || state?.status === 'failed') {
          await handleConnect(config);
          
          // Small delay between connections
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Failed to connect to all servers:', error);
    }
  };

  const getConnectionState = (configId: string): ConnectionStatus => {
    return connectionStates.find(s => s.configId === configId) || {
      configId,
      status: 'idle',
    };
  };

  const connectedCount = connectionStates.filter(s => s.status === 'connected').length;
  const failedCount = connectionStates.filter(s => s.status === 'failed').length;
  const connectingCount = connectionStates.filter(s => s.status === 'connecting').length;

  return (
    <Animated.View 
      entering={SlideInRight} 
      exiting={SlideOutLeft}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={onBack}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Quick Connect
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Connect to your servers with one tap
      </Text>

      {/* Status Summary */}
      {(connectedCount > 0 || failedCount > 0 || connectingCount > 0) && (
        <Animated.View entering={FadeIn} style={styles.statusSummary}>
          <StatusBadge 
            count={connectedCount} 
            label="Connected" 
            color={theme.colors.success}
            icon="✅"
          />
          <StatusBadge 
            count={connectingCount} 
            label="Connecting" 
            color={theme.colors.warning}
            icon="🔄"
          />
          <StatusBadge 
            count={failedCount} 
            label="Failed" 
            color={theme.colors.error}
            icon="❌"
          />
        </Animated.View>
      )}

      {/* Server List */}
      <ScrollView style={styles.serverList} showsVerticalScrollIndicator={false}>
        {configs.map((config) => {
          const connectionState = getConnectionState(config.id);
          return (
            <ServerCard
              key={config.id}
              config={config}
              connectionState={connectionState}
              onConnect={() => handleConnect(config)}
              theme={theme}
            />
          );
        })}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        {configs.length > 1 && connectingCount === 0 && (
          <TouchableOpacity
            style={[styles.connectAllButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleConnectAll}
          >
            <Text style={styles.connectAllButtonText}>Connect to All Servers</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

function ServerCard({ 
  config, 
  connectionState, 
  onConnect,
  theme 
}: {
  config: SSHConfig;
  connectionState: ConnectionStatus;
  onConnect: () => void;
  theme: any;
}) {
  const scaleValue = useSharedValue(1);

  const onPressIn = () => {
    scaleValue.value = withTiming(0.95, { duration: 100 });
  };

  const onPressOut = () => {
    scaleValue.value = withSequence(
      withTiming(1.02, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const getStatusColor = () => {
    switch (connectionState.status) {
      case 'connected': return theme.colors.success;
      case 'connecting': return theme.colors.warning;
      case 'failed': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (connectionState.status) {
      case 'connected': return '✅';
      case 'connecting': return '🔄';
      case 'failed': return '❌';
      default: return '⚡';
    }
  };

  const getStatusText = () => {
    switch (connectionState.status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'failed': return connectionState.error || 'Failed';
      default: return 'Ready to connect';
    }
  };

  const isDisabled = connectionState.status === 'connecting' || connectionState.status === 'connected';

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.serverCard,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: connectionState.status === 'connected' 
              ? theme.colors.success 
              : 'transparent',
            borderWidth: connectionState.status === 'connected' ? 2 : 0,
          }
        ]}
        onPress={onConnect}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.serverInfo}>
            <Text style={[styles.serverName, { color: theme.colors.text }]}>
              {config.name || `${config.user}@${config.hostname}`}
            </Text>
            <Text style={[styles.serverAddress, { color: theme.colors.textSecondary }]}>
              {config.hostname}:{config.port}
            </Text>
            <View style={styles.serverMeta}>
              <Text style={[styles.keyType, { color: theme.colors.textSecondary }]}>
                {config.keyType.toUpperCase()} key
              </Text>
              {config.lastUsed && (
                <Text style={[styles.lastUsed, { color: theme.colors.textSecondary }]}>
                  • Last used {new Date(config.lastUsed).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.statusIndicator}>
            <Text style={[styles.statusIcon, { color: getStatusColor() }]}>
              {getStatusIcon()}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          
          {connectionState.status === 'idle' && (
            <View style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function StatusBadge({ 
  count, 
  label, 
  color, 
  icon 
}: { 
  count: number; 
  label: string; 
  color: string; 
  icon: string; 
}) {
  if (count === 0) return null;

  return (
    <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeIcon, { color }]}>{icon}</Text>
      <Text style={[styles.badgeCount, { color }]}>{count}</Text>
      <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  statusSummary: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  serverList: {
    flex: 1,
    marginBottom: 20,
  },
  serverCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serverAddress: {
    fontSize: 14,
    marginBottom: 6,
  },
  serverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyType: {
    fontSize: 12,
  },
  lastUsed: {
    fontSize: 12,
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  connectAllButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});