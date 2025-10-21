import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  List,
  Divider,
  useTheme,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ComponentDetail'>;

interface ComponentDetailProps {
  componentId: string;
  componentName: string;
}

const ComponentDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { componentId, componentName } = route.params;

  // Mock component data - in real app, this would come from API
  const componentData = {
    id: componentId,
    name: componentName,
    description: 'A versatile and highly customizable React Native component built with Katalyst design system principles.',
    version: '2.1.0',
    author: 'Katalyst Team',
    category: 'UI Components',
    downloads: 15420,
    rating: 4.8,
    license: 'MIT',
    repository: 'https://github.com/katalyst/components',
    documentation: 'https://docs.katalyst.dev/components',
    changelog: 'https://github.com/katalyst/components/releases',
    tags: ['responsive', 'animated', 'customizable', 'typescript'],
    dependencies: ['react', 'react-native', '@katalyst/design-system'],
    peerDependencies: ['react-native-vector-icons'],
    compatibility: {
      ios: '>= 12.0',
      android: '>= 21',
      expo: '>= 48.0',
    },
    lastUpdated: '2 days ago',
    createdAt: '3 months ago',
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${componentData.name} - ${componentData.description}\n\n${componentData.repository}`,
        title: componentData.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share component');
    }
  };

  const handleInstall = () => {
    Alert.alert(
      'Install Component',
      `Would you like to add ${componentData.name} to your project?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Install', onPress: () => {} },
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <Card style={styles.sectionCard}>
        <Card.Content>
          {children}
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View style={styles.titleSection}>
                <Text variant="headlineMedium" style={styles.componentName}>
                  {componentData.name}
                </Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {componentData.description}
                </Text>
              </View>
              <View style={styles.statsSection}>
                <View style={styles.statItem}>
                  <Icon name="star" size={20} color={theme.colors.secondary} />
                  <Text variant="bodySmall" style={styles.statText}>
                    {componentData.rating}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="download" size={20} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={styles.statText}>
                    {componentData.downloads.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.tagsContainer}>
              {componentData.tags.map((tag, index) => (
                <Chip key={index} style={styles.tag} compact>
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Quick Info */}
        {renderSection('Quick Info', (
          <>
            <List.Item
              title="Version"
              description={componentData.version}
              left={(props) => <Icon {...props} name="tag" size={24} />}
            />
            <Divider />
            <List.Item
              title="Author"
              description={componentData.author}
              left={(props) => <Icon {...props} name="account" size={24} />}
            />
            <Divider />
            <List.Item
              title="License"
              description={componentData.license}
              left={(props) => <Icon {...props} name="license" size={24} />}
            />
            <Divider />
            <List.Item
              title="Category"
              description={componentData.category}
              left={(props) => <Icon {...props} name="folder" size={24} />}
            />
          </>
        ))}

        {/* Compatibility */}
        {renderSection('Compatibility', (
          <>
            <View style={styles.compatibilityItem}>
              <View style={styles.platformHeader}>
                <Icon name="apple" size={24} color="#000" />
                <Text variant="bodyMedium">iOS</Text>
              </View>
              <Text variant="bodySmall">{componentData.compatibility.ios}</Text>
            </View>
            <View style={styles.compatibilityItem}>
              <View style={styles.platformHeader}>
                <Icon name="android" size={24} color="#3DDC84" />
                <Text variant="bodyMedium">Android</Text>
              </View>
              <Text variant="bodySmall">{componentData.compatibility.android}</Text>
            </View>
            <View style={styles.compatibilityItem}>
              <View style={styles.platformHeader}>
                <Icon name="rocket" size={24} color="#0D2540" />
                <Text variant="bodyMedium">Expo</Text>
              </View>
              <Text variant="bodySmall">{componentData.compatibility.expo}</Text>
            </View>
          </>
        ))}

        {/* Dependencies */}
        {renderSection('Dependencies', (
          <>
            <Text variant="bodySmall" style={styles.dependencyLabel}>Dependencies:</Text>
            {componentData.dependencies.map((dep, index) => (
              <Text key={index} variant="bodySmall" style={styles.dependency}>
                • {dep}
              </Text>
            ))}
            <Text variant="bodySmall" style={[styles.dependencyLabel, { marginTop: 12 }]}>
              Peer Dependencies:
            </Text>
            {componentData.peerDependencies.map((dep, index) => (
              <Text key={index} variant="bodySmall" style={styles.dependency}>
                • {dep}
              </Text>
            ))}
          </>
        ))}

        {/* Links */}
        {renderSection('Resources', (
          <>
            <List.Item
              title="Documentation"
              description="View detailed documentation"
              left={(props) => <Icon {...props} name="book-open" size={24} />}
              right={(props) => <Icon {...props} name="external-link" size={24} />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Repository"
              description="View source code on GitHub"
              left={(props) => <Icon {...props} name="github" size={24} />}
              right={(props) => <Icon {...props} name="external-link" size={24} />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Changelog"
              description="View version history"
              left={(props) => <Icon {...props} name="history" size={24} />}
              right={(props) => <Icon {...props} name="external-link" size={24} />}
              onPress={() => {}}
            />
          </>
        ))}

        {/* Timeline */}
        {renderSection('Timeline', (
          <>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text variant="bodyMedium">Last Updated</Text>
                <Text variant="bodySmall">{componentData.lastUpdated}</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text variant="bodyMedium">Created</Text>
                <Text variant="bodySmall">{componentData.createdAt}</Text>
              </View>
            </View>
          </>
        ))}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleInstall}
            style={styles.installButton}
            icon="download"
          >
            Install Component
          </Button>
          <Button
            mode="outlined"
            onPress={handleShare}
            style={styles.shareButton}
            icon="share"
          >
            Share
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
    marginBottom: 16,
  },
  titleSection: {
    marginBottom: 12,
  },
  componentName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    opacity: 0.8,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    height: 28,
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
  compatibilityItem: {
    marginBottom: 16,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dependencyLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  dependency: {
    marginLeft: 8,
    marginBottom: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginTop: 6,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  installButton: {
    flex: 2,
  },
  shareButton: {
    flex: 1,
  },
});

export default ComponentDetailScreen;
