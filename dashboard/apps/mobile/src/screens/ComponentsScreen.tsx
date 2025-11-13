import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text,
  Searchbar,
  Chip,
  FAB,
  useTheme,
  Button,
  Portal,
  Modal,
  List,
  Divider,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  downloads: number;
  rating: number;
  tags: string[];
  lastUpdated: string;
}

const ComponentsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = ['All', 'UI Components', 'Forms', 'Navigation', 'Data Display', 'Feedback'];

  const components: Component[] = [
    {
      id: '1',
      name: 'Card Component',
      category: 'UI Components',
      description: 'Versatile card component with header, content, and actions',
      version: '2.1.0',
      downloads: 15420,
      rating: 4.8,
      tags: ['responsive', 'animated', 'customizable'],
      lastUpdated: '2 days ago',
    },
    {
      id: '2',
      name: 'Form Builder',
      category: 'Forms',
      description: 'Dynamic form builder with validation and submission',
      version: '1.5.2',
      downloads: 12300,
      rating: 4.6,
      tags: ['validation', 'schema', 'typescript'],
      lastUpdated: '1 week ago',
    },
    {
      id: '3',
      name: 'Navigation Stack',
      category: 'Navigation',
      description: 'Stack navigation with gestures and animations',
      version: '3.0.1',
      downloads: 18900,
      rating: 4.9,
      tags: ['gestures', 'animated', 'typescript'],
      lastUpdated: '3 days ago',
    },
    {
      id: '4',
      name: 'Data Table',
      category: 'Data Display',
      description: 'Advanced data table with sorting, filtering, and pagination',
      version: '1.8.0',
      downloads: 9800,
      rating: 4.5,
      tags: ['sortable', 'filterable', 'responsive'],
      lastUpdated: '5 days ago',
    },
    {
      id: '5',
      name: 'Toast Notification',
      category: 'Feedback',
      description: 'Elegant toast notifications with queue management',
      version: '2.2.1',
      downloads: 22100,
      rating: 4.7,
      tags: ['queue', 'animations', 'positioning'],
      lastUpdated: '1 day ago',
    },
    {
      id: '6',
      name: 'Button Group',
      category: 'UI Components',
      description: 'Grouped buttons with various layouts and states',
      version: '1.3.0',
      downloads: 8900,
      rating: 4.4,
      tags: ['grouped', 'states', 'layout'],
      lastUpdated: '4 days ago',
    },
  ];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderComponent = ({ item }: { item: Component }) => (
    <Card
      style={styles.componentCard}
      onPress={() => {
        setSelectedComponent(item);
        setModalVisible(true);
      }}
    >
      <Card.Content>
        <View style={styles.componentHeader}>
          <Text variant="titleMedium" style={styles.componentName}>
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={theme.colors.secondary} />
            <Text variant="bodySmall" style={styles.rating}>
              {item.rating}
            </Text>
          </View>
        </View>
        
        <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="download" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={styles.metaText}>
              {item.downloads.toLocaleString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="tag" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={styles.metaText}>
              {item.version}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={styles.metaText}>
              {item.lastUpdated}
            </Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <Chip key={index} style={styles.tag} compact>
              {tag}
            </Chip>
          ))}
          {item.tags.length > 3 && (
            <Text variant="bodySmall" style={styles.moreTags}>
              +{item.tags.length - 3} more
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search components..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && { backgroundColor: theme.colors.primary }
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === item && { color: theme.colors.onPrimary }
              ]}
            >
              {item}
            </Chip>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Components List */}
      <FlatList
        data={filteredComponents}
        renderItem={renderComponent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.componentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="package-variant" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={styles.emptyText}>
              No components found
            </Text>
          </View>
        }
      />

      {/* Component Detail Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          {selectedComponent && (
            <View>
              <View style={styles.modalHeader}>
                <Text variant="headlineSmall">{selectedComponent.name}</Text>
                <Button onPress={() => setModalVisible(false)}>
                  Close
                </Button>
              </View>
              
              <Divider style={styles.divider} />
              
              <Text variant="bodyMedium" style={styles.modalDescription}>
                {selectedComponent.description}
              </Text>
              
              <View style={styles.modalMeta}>
                <List.Item
                  title="Category"
                  description={selectedComponent.category}
                  left={(props) => <Icon {...props} name="folder" size={24} />}
                />
                <List.Item
                  title="Version"
                  description={selectedComponent.version}
                  left={(props) => <Icon {...props} name="tag" size={24} />}
                />
                <List.Item
                  title="Downloads"
                  description={selectedComponent.downloads.toLocaleString()}
                  left={(props) => <Icon {...props} name="download" size={24} />}
                />
                <List.Item
                  title="Rating"
                  description={`${selectedComponent.rating}/5.0`}
                  left={(props) => <Icon {...props} name="star" size={24} />}
                />
              </View>
              
              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('ComponentDetail', {
                      componentId: selectedComponent.id,
                      componentName: selectedComponent.name,
                    });
                    setModalVisible(false);
                  }}
                  style={styles.modalButton}
                >
                  View Details
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Use Component
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {}}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  categoriesContainer: {
    paddingLeft: 16,
    paddingBottom: 16,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 12,
  },
  componentsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  componentCard: {
    marginBottom: 12,
    elevation: 1,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  componentName: {
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontWeight: '600',
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    opacity: 0.7,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  tag: {
    height: 24,
  },
  moreTags: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    opacity: 0.6,
  },
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    marginBottom: 20,
    lineHeight: 22,
  },
  modalMeta: {
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  divider: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
});

export default ComponentsScreen;
