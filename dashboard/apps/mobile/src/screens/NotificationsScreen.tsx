import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Text,
  List,
  useTheme,
  Switch,
  Chip,
  Button,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Component Update Available',
      message: 'Card Component v2.1.1 is now available with bug fixes and performance improvements.',
      time: '2 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: '2',
      title: 'Your Template Was Approved',
      message: 'Your "Navigation Template" has been approved and is now live in the component library.',
      time: '5 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: '3',
      title: 'New Features Released',
      message: 'Check out the new animation system and enhanced theming options in Katalyst v3.2.',
      time: '1 day ago',
      type: 'info',
      read: true,
    },
    {
      id: '4',
      title: 'Build Warning',
      message: 'Your project has deprecated dependencies that should be updated soon.',
      time: '2 days ago',
      type: 'warning',
      read: true,
    },
    {
      id: '5',
      title: 'Maintenance Scheduled',
      message: 'Katalyst services will be unavailable on Sunday from 2-4 AM EST.',
      time: '3 days ago',
      type: 'warning',
      read: true,
    },
    {
      id: '6',
      title: 'Welcome to Katalyst Mobile!',
      message: 'Get started with our comprehensive mobile development framework and component library.',
      time: '1 week ago',
      type: 'success',
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return theme.colors.primary;
      case 'warning':
        return '#FF9800';
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'alert';
      case 'error':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <Card
      style={[
        styles.notificationCard,
        !item.read && { backgroundColor: theme.colors.surfaceVariant }
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <Card.Content>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationTitleRow}>
            <Icon
              name={getTypeIcon(item.type)}
              size={20}
              color={getTypeColor(item.type)}
            />
            <Text variant="titleMedium" style={styles.notificationTitle}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text variant="bodySmall" style={styles.notificationTime}>
            {item.time}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.notificationMessage}>
          {item.message}
        </Text>
        <View style={styles.notificationActions}>
          <Button
            mode="text"
            onPress={() => deleteNotification(item.id)}
            compact
            icon="delete"
            textColor={theme.colors.error}
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Chip icon="bell" style={styles.unreadChip}>
              {unreadCount} new
            </Chip>
          )}
        </View>
        
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={filter === 'unread'}
            onPress={() => setFilter('unread')}
            style={styles.filterChip}
          >
            Unread
          </Chip>
          <Chip
            selected={filter === 'read'}
            onPress={() => setFilter('read')}
            style={styles.filterChip}
          >
            Read
          </Chip>
        </View>
        
        {/* Action Buttons */}
        {notifications.length > 0 && (
          <View style={styles.actionButtons}>
            {unreadCount > 0 && (
              <Button
                mode="outlined"
                onPress={markAllAsRead}
                compact
                style={styles.actionButton}
              >
                Mark All Read
              </Button>
            )}
            <Button
              mode="text"
              onPress={clearAllNotifications}
              compact
              textColor={theme.colors.error}
            >
              Clear All
            </Button>
          </View>
        )}
      </View>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon
            name="bell-off"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="titleMedium" style={styles.emptyTitle}>
            No notifications
          </Text>
          <Text variant="bodyMedium" style={styles.emptyMessage}>
            {filter === 'unread'
              ? "You're all caught up!"
              : filter === 'read'
              ? 'No read notifications yet'
              : 'No notifications yet'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  unreadChip: {
    height: 28,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    height: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 12,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
    elevation: 1,
  },
  notificationHeader: {
    marginBottom: 8,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  notificationTime: {
    opacity: 0.6,
    marginLeft: 28,
  },
  notificationMessage: {
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyMessage: {
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
