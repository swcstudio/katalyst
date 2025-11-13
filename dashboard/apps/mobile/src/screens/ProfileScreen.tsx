import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Card,
  Text,
  List,
  Avatar,
  Button,
  Divider,
  useTheme,
  Chip,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/providers/AuthProvider';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const profileStats = [
    { label: 'Components Created', value: '24', icon: 'view-module' },
    { label: 'Templates', value: '8', icon: 'file-document' },
    { label: 'Downloads', value: '1.2K', icon: 'download' },
    { label: 'Following', value: '42', icon: 'account-heart' },
  ];

  const skills = [
    'React Native',
    'TypeScript',
    'UI/UX Design',
    'Component Architecture',
    'State Management',
  ];

  const recentActivity = [
    { id: '1', title: 'Published Card Component', time: '2 hours ago', icon: 'rocket-launch' },
    { id: '2', title: 'Updated Button Group', time: '1 day ago', icon: 'pencil' },
    { id: '3', title: 'Created Navigation Template', time: '3 days ago', icon: 'plus-circle' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Icon 
              size={80} 
              icon="account" 
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineMedium" style={styles.userName}>
                {user?.name || 'Katalyst User'}
              </Text>
              <Text variant="bodyMedium" style={styles.userEmail}>
                {user?.email || 'user@katalyst.dev'}
              </Text>
              <View style={styles.badges}>
                <Chip icon="star" compact style={styles.badge}>
                  Pro Developer
                </Chip>
                <Chip icon="verified" compact style={styles.badge}>
                  Verified
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Icon name={stat.icon} size={24} color={theme.colors.primary} />
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stat.value}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Bio */}
        <Card style={styles.bioCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="bodyMedium" style={styles.bioText}>
              Passionate React Native developer and UI/UX enthusiast. 
              Love creating beautiful, performant mobile components that make development easier for everyone.
              Currently contributing to the Katalyst design system and building amazing mobile experiences.
            </Text>
          </Card.Content>
        </Card>

        {/* Skills */}
        <Card style={styles.skillsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Skills
            </Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Chip key={index} style={styles.skillChip}>
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Activity
            </Text>
            {recentActivity.map((activity, index) => (
              <View key={activity.id}>
                <List.Item
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
                />
                {index < recentActivity.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Settings Links */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <List.Item
              title="Edit Profile"
              description="Update your profile information"
              left={(props) => <Icon {...props} name="account-edit" size={24} />}
              right={(props) => <Icon {...props} name="chevron-right" size={24} />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Account Settings"
              description="Manage your account preferences"
              left={(props) => <Icon {...props} name="cog" size={24} />}
              right={(props) => <Icon {...props} name="chevron-right" size={24} />}
              onPress={() => navigation.navigate('Settings')}
            />
            <Divider />
            <List.Item
              title="Privacy Settings"
              description="Control your privacy and data"
              left={(props) => <Icon {...props} name="shield-account" size={24} />}
              right={(props) => <Icon {...props} name="chevron-right" size={24} />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              description="Get help with your account"
              left={(props) => <Icon {...props} name="help-circle" size={24} />}
              right={(props) => <Icon {...props} name="chevron-right" size={24} />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={logout}
            style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          >
            Logout
          </Button>
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
  headerCard: {
    marginBottom: 24,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    height: 28,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
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
  statLabel: {
    opacity: 0.7,
    textAlign: 'center',
  },
  bioCard: {
    marginBottom: 24,
    elevation: 1,
  },
  skillsCard: {
    marginBottom: 24,
    elevation: 1,
  },
  activityCard: {
    marginBottom: 24,
    elevation: 1,
  },
  settingsCard: {
    marginBottom: 24,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bioText: {
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 40,
  },
  backButton: {
    flex: 1,
  },
  logoutButton: {
    flex: 1,
  },
});

export default ProfileScreen;
