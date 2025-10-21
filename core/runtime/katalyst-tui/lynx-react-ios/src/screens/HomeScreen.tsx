import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIDEStore } from '../stores/ideStore';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { recentFiles, config } = useIDEStore();

  const menuItems = [
    {
      title: 'Code Editor',
      icon: 'code',
      screen: 'Editor',
      color: '#4CAF50',
      description: 'Write and edit code with syntax highlighting',
    },
    {
      title: 'Terminal',
      icon: 'terminal',
      screen: 'Terminal',
      color: '#2196F3',
      description: 'Run commands in the integrated terminal',
    },
    {
      title: 'File Explorer',
      icon: 'folder',
      screen: 'FileExplorer',
      color: '#FF9800',
      description: 'Browse and manage your files',
    },
    {
      title: 'Sandbox',
      icon: 'security',
      screen: 'Sandbox',
      color: '#9C27B0',
      description: 'Execute code in a secure sandbox',
    },
    {
      title: 'Settings',
      icon: 'settings',
      screen: 'Settings',
      color: '#607D8B',
      description: 'Configure IDE preferences',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Lynx IDE</Text>
          <Text style={styles.subtitle}>WebAssembly-powered development on iOS</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {recentFiles.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Files</Text>
            {recentFiles.slice(0, 5).map((file, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentFile}
                onPress={() => navigation.navigate('Editor', { filePath: file.path })}
              >
                <Icon name="insert-drive-file" size={20} color="#666" />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.filePath}>{file.path}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{recentFiles.length}</Text>
            <Text style={styles.statLabel}>Recent Files</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{config.fontSize}px</Text>
            <Text style={styles.statLabel}>Font Size</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{config.theme}</Text>
            <Text style={styles.statLabel}>Theme</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  recentFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filePath: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen;