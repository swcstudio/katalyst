import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  FAB,
  List,
  useTheme,
  Surface,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/providers/AuthProvider';
import { useNetwork } from '@/providers/NetworkProvider';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { isConnected, isInternetReachable } = useNetwork();

  const stats = [
    { title: 'Components', value: '42', icon: 'view-module', color: theme.colors.primary },
    { title: 'Templates', value: '18', icon: 'file-document-outline', color: theme.colors.secondary },
    { title: 'Projects', value: '7', icon: 'folder-outline', color: theme.colors.tertiary },
    { title: 'Active Users', value: '256', icon: 'account-group', color: theme.colors.error },
  ];

  const recentActivities = [
    { id: '1', title: 'Updated Dashboard Component', time: '2 hours ago', icon: 'pencil' },
    { id: '2', title: 'Created New Template', time: '5 hours ago', icon: 'plus-circle' },
    { id: '3', title: 'Published to Production', time: '1 day ago', icon: 'rocket-launch' },
    { id: '4', title: 'Fixed Navigation Bug', time: '2 days ago', icon: 'bug' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text variant="headlineMedium" style={styles.welcomeText}>
                Welcome back, {user?.name || 'User'}!
              </Text>
              <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Here's your Katalyst overview
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={logout}
              style={styles.logoutButton}
              compact
            >
              Logout
            </Button>
          </View>
        </Surface>

        {/* Network Status */}
        {!isConnected && (
          <Card style={styles.networkCard}>
            <Card.Content style={styles.networkContent}>
              <Icon name="wifi-off" size={24} color={theme.colors.error} />
              <Text variant="bodyMedium" style={styles.networkText}>
                No internet connection
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Card.Content style={styles.statContent}>
                <Icon name={stat.icon} size={24} color={stat.color} />
                <Text variant="headlineMedium" style={styles.statValue}>
                  {stat.value}
                </Text>
                <Text variant="bodySmall" style={styles.statTitle}>
                  {stat.title}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Progress Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Project Progress
            </Text>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text variant="bodyMedium">Mobile App</Text>
                <Text variant="bodySmall">75%</Text>
              </View>
              <ProgressBar progress={0.75} color={theme.colors.primary} />
            </View>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text variant="bodyMedium">Design System</Text>
                <Text variant="bodySmall">90%</Text>
              </View>
              <ProgressBar progress={0.9} color={theme.colors.secondary} />
            </View>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text variant="bodyMedium">Documentation</Text>
                <Text variant="bodySmall">45%</Text>
              </View>
              <ProgressBar progress={0.45} color={theme.colors.tertiary} />
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activities */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Recent Activities
            </Text>
            {recentActivities.map((activity) => (
              <List.Item
                key={activity.id}
                title={activity.title}
                description={activity.time}
                left={(props) => (
                  <Icon
                    {...props}
                    name={activity.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
                style={styles.activityItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Quick Actions
            </Text>
            <View style={styles.chipsContainer}>
              <Chip 
                icon="plus" 
                onPress={() => navigation.navigate('Components')}
                style={styles.chip}
              >
                New Component
              </Chip>
              <Chip 
                icon="file-document" 
                onPress={() => {}}
                style={styles.chip}
              >
                New Template
              </Chip>
              <Chip 
                icon="folder-plus" 
                onPress={() => {}}
                style={styles.chip}
              >
                New Project
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Components')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  logoutButton: {
    marginLeft: 16,
  },
  networkCard: {
    marginBottom: 16,
    backgroundColor: '#ffebee',
  },
  networkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  networkText: {
    color: '#c62828',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    borderLeftWidth: 4,
    elevation: 1,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statTitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activityItem: {
    paddingVertical: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
});

export default DashboardScreen;
