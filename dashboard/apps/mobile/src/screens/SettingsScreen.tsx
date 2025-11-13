import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import {
  List,
  Text,
  Divider,
  useTheme,
  Switch as PaperSwitch,
  Button,
  Card,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useAppTheme();
  const { user } = useAuth();
  
  const [notifications, setNotifications] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);
  const [hapticFeedback, setHapticFeedback] = React.useState(true);
  const [analytics, setAnalytics] = React.useState(false);

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          title: 'Dark Mode',
          description: 'Use dark theme across the app',
          icon: 'theme-light-dark',
          action: 'switch',
          value: isDark,
          onToggle: toggleTheme,
        },
        {
          title: 'Color Theme',
          description: 'Customize app colors',
          icon: 'palette',
          action: 'navigation',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          title: 'Push Notifications',
          description: 'Receive push notifications',
          icon: 'bell',
          action: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          title: 'Email Notifications',
          description: 'Receive email updates',
          icon: 'email',
          action: 'navigation',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          title: 'Auto Sync',
          description: 'Automatically sync data',
          icon: 'sync',
          action: 'switch',
          value: autoSync,
          onToggle: setAutoSync,
        },
        {
          title: 'Clear Cache',
          description: 'Free up storage space',
          icon: 'delete-sweep',
          action: 'button',
          onPress: () => {},
        },
        {
          title: 'Storage Usage',
          description: 'Manage app storage',
          icon: 'storage',
          action: 'navigation',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Accessibility',
      items: [
        {
          title: 'Haptic Feedback',
          description: 'Vibration feedback on interactions',
          icon: 'vibrate',
          action: 'switch',
          value: hapticFeedback,
          onToggle: setHapticFeedback,
        },
        {
          title: 'Large Text',
          description: 'Increase text size',
          icon: 'format-size',
          action: 'navigation',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          title: 'Analytics',
          description: 'Help improve the app with usage data',
          icon: 'chart-bar',
          action: 'switch',
          value: analytics,
          onToggle: setAnalytics,
        },
        {
          title: 'Privacy Policy',
          description: 'Read our privacy policy',
          icon: 'shield-account',
          action: 'navigation',
          onPress: () => {},
        },
        {
          title: 'Terms of Service',
          description: 'Read our terms of service',
          icon: 'file-document',
          action: 'navigation',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Help Center',
          description: 'Get help and support',
          icon: 'help-circle',
          action: 'navigation',
          onPress: () => {},
        },
        {
          title: 'Contact Us',
          description: 'Get in touch with our team',
          icon: 'email',
          action: 'navigation',
          onPress: () => {},
        },
        {
          title: 'Report a Bug',
          description: 'Help us improve the app',
          icon: 'bug',
          action: 'navigation',
          onPress: () => {},
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    switch (item.action) {
      case 'switch':
        return (
          <List.Item
            key={index}
            title={item.title}
            description={item.description}
            left={(props) => <Icon {...props} name={item.icon} size={24} />}
            right={() => (
              <PaperSwitch
                value={item.value}
                onValueChange={item.onToggle}
              />
            )}
          />
        );
      case 'button':
        return (
          <List.Item
            key={index}
            title={item.title}
            description={item.description}
            left={(props) => <Icon {...props} name={item.icon} size={24} />}
            right={() => (
              <Button
                mode="outlined"
                onPress={item.onPress}
                compact
              >
                Execute
              </Button>
            )}
          />
        );
      default:
        return (
          <List.Item
            key={index}
            title={item.title}
            description={item.description}
            left={(props) => <Icon {...props} name={item.icon} size={24} />}
            right={(props) => <Icon {...props} name="chevron-right" size={24} />}
            onPress={item.onPress}
          />
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.profileInfo}>
              <Icon name="account-circle" size={48} color={theme.colors.primary} />
              <View style={styles.profileText}>
                <Text variant="titleMedium">{user?.name || 'Katalyst User'}</Text>
                <Text variant="bodyMedium" style={styles.email}>
                  {user?.email || 'user@katalyst.dev'}
                </Text>
              </View>
            </View>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Profile')}
              compact
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text variant="labelMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              {section.title.toUpperCase()}
            </Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderSettingItem(item, itemIndex)}
                  {itemIndex < section.items.length - 1 && <Divider />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              Katalyst Mobile
            </Text>
            <Text variant="bodyMedium" style={styles.version}>
              Version 0.1.0 (Build 1)
            </Text>
            <Text variant="bodySmall" style={styles.description}>
              The official mobile frontend for the Katalyst framework. Built with React Native and Lynx.
            </Text>
            <View style={styles.links}>
              <Button
                mode="text"
                onPress={() => {}}
                compact
              >
                GitHub
              </Button>
              <Button
                mode="text"
                onPress={() => {}}
                compact
              >
                Documentation
              </Button>
              <Button
                mode="text"
                onPress={() => {}}
                compact
              >
                Community
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Made with ❤️ by the Katalyst Team
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 24,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  email: {
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    elevation: 1,
  },
  infoCard: {
    marginBottom: 24,
    elevation: 1,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  version: {
    opacity: 0.7,
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    marginBottom: 16,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    opacity: 0.6,
  },
});

export default SettingsScreen;
