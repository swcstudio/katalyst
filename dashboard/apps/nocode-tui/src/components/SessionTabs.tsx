import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { useTheme } from '../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SessionTabsProps {
  sessions: any[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onCloseSession: (sessionId: string) => void;
}

export function SessionTabs({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onCloseSession,
}: SessionTabsProps) {
  const theme = useTheme();

  const handleSelectSession = (sessionId: string) => {
    if (sessionId !== activeSessionId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectSession(sessionId);
    }
  };

  const handleNewSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNewSession();
  };

  const handleCloseSession = (sessionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCloseSession(sessionId);
  };

  if (sessions.length === 0) {
    return null;
  }

  return (
    <BlurView intensity={90} tint="dark" style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {sessions.map((session, index) => (
          <SessionTab
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onPress={() => handleSelectSession(session.id)}
            onClose={() => handleCloseSession(session.id)}
            canClose={sessions.length > 1}
          />
        ))}
        
        {/* New Session Button */}
        <TouchableOpacity
          style={[styles.newButton, { backgroundColor: theme.colors.primary + '20' }]}
          onPress={handleNewSession}
        >
          <Text style={[styles.newButtonText, { color: theme.colors.primary }]}>
            +
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </BlurView>
  );
}

interface SessionTabProps {
  session: any;
  isActive: boolean;
  onPress: () => void;
  onClose: () => void;
  canClose: boolean;
}

function SessionTab({ session, isActive, onPress, onClose, canClose }: SessionTabProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 400 });
    }, 100);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getSessionTitle = () => {
    if (session.name) return session.name;
    if (session.connection) return session.connection.split('@')[1] || session.connection;
    return `Terminal ${session.id.slice(0, 6)}`;
  };

  return (
    <Animated.View style={animatedStyle} entering={FadeIn} exiting={FadeOut}>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: isActive ? theme.colors.primary + '20' : 'transparent',
            borderColor: isActive ? theme.colors.primary : 'transparent',
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.tabContent}>
          {/* Connection Status Dot */}
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: session.connected
                  ? theme.colors.success
                  : theme.colors.warning,
              },
            ]}
          />
          
          {/* Session Title */}
          <Text
            style={[
              styles.tabTitle,
              {
                color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                maxWidth: 80,
              },
            ]}
            numberOfLines={1}
          >
            {getSessionTitle()}
          </Text>

          {/* Close Button */}
          {canClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={(e) => {
                e.stopPropagation();
                onClose();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>
                ×
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Activity Indicator */}
        {session.hasActivity && (
          <Animated.View
            style={[
              styles.activityIndicator,
              { backgroundColor: theme.colors.accent },
            ]}
            entering={FadeIn}
            exiting={FadeOut}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    position: 'relative',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  tabTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 6,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  activityIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  newButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});