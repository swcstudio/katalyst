import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { QuickActionButton } from '../components/QuickActionButton';
import { ServerCard } from '../components/ServerCard';
import { TerminalPreview } from '../components/TerminalPreview';
import { useTheme } from '../hooks/useTheme';
import { useConnections } from '../hooks/useConnections';
import { useTerminal } from '../hooks/useTerminal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { recentServers, activeConnections } = useConnections();
  const { activeSessions } = useTerminal();
  
  const scrollY = useSharedValue(0);

  const handleQuickConnect = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Connect');
  };

  const handleNewSession = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Terminal', { sessionId: 'new' });
  };

  const handleOpenSettings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
    );
    
    return {
      opacity,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -20],
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary + '20', 'transparent']}
        style={styles.gradient}
      />
      
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
          Welcome back
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Terminal Hub
        </Text>
      </Animated.View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <QuickActionButton
              icon="terminal"
              label="New Session"
              onPress={handleNewSession}
              color={theme.colors.primary}
            />
            <QuickActionButton
              icon="server"
              label="Connect"
              onPress={handleQuickConnect}
              color={theme.colors.accent}
            />
            <QuickActionButton
              icon="key"
              label="SSH Keys"
              onPress={() => navigation.navigate('SSHKeys')}
              color={theme.colors.success}
            />
            <QuickActionButton
              icon="folder"
              label="Repositories"
              onPress={() => navigation.navigate('Repositories')}
              color={theme.colors.warning}
            />
          </View>
        </View>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Active Sessions
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sessionsScroll}
            >
              {activeSessions.map((session) => (
                <TerminalPreview
                  key={session.id}
                  session={session}
                  onPress={() => navigation.navigate('Terminal', { sessionId: session.id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent Servers */}
        {recentServers.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Servers
            </Text>
            {recentServers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onPress={() => navigation.navigate('Connect', { serverId: server.id })}
              />
            ))}
          </View>
        )}

        {/* Status Bar */}
        <BlurView intensity={80} tint="dark" style={styles.statusBar}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
            <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
              {activeConnections} active
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.statusItem}
            onPress={handleOpenSettings}
          >
            <Text style={[styles.statusText, { color: theme.colors.primary }]}>
              Settings
            </Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sessionsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
});