import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import { useTheme } from '../providers/ThemeProvider';
import { useIDEStore } from '../stores/ideStore';

interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

interface FileExplorerScreenProps {
  navigation: any;
}

const FileExplorerScreen: React.FC<FileExplorerScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { addRecentFile } = useIDEStore();
  
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = async (path: string) => {
    setLoading(true);
    
    // Simulated file system
    const mockFiles: FileItem[] = [
      { id: '1', name: 'src', path: '/src', type: 'directory' },
      { id: '2', name: 'package.json', path: '/package.json', type: 'file', size: 1024 },
      { id: '3', name: 'README.md', path: '/README.md', type: 'file', size: 2048 },
      { id: '4', name: 'tsconfig.json', path: '/tsconfig.json', type: 'file', size: 512 },
      { id: '5', name: 'node_modules', path: '/node_modules', type: 'directory' },
      { id: '6', name: '.gitignore', path: '/.gitignore', type: 'file', size: 256 },
    ];
    
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 500);
  };

  const handleFilePress = (file: FileItem) => {
    if (file.type === 'directory') {
      setCurrentPath(file.path);
    } else {
      addRecentFile(file.path);
      navigation.navigate('Editor', { filePath: file.path });
    }
  };

  const handleLongPress = (file: FileItem) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(file.id)) {
        newSet.delete(file.id);
      } else {
        newSet.add(file.id);
      }
      return newSet;
    });
  };

  const handleImportFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      Alert.alert('File Imported', `Imported: ${result[0].name}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        Alert.alert('Error', 'Failed to import file');
      }
    }
  };

  const handleCreateNew = () => {
    Alert.prompt(
      'Create New File',
      'Enter file name:',
      (fileName) => {
        if (fileName) {
          const newPath = `${currentPath}/${fileName}`;
          addRecentFile(newPath);
          navigation.navigate('Editor', { filePath: newPath });
        }
      },
      'plain-text'
    );
  };

  const navigateUp = () => {
    if (currentPath !== '/') {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
      setCurrentPath(parentPath);
    }
  };

  const renderFile = ({ item }: { item: FileItem }) => {
    const isSelected = selectedFiles.has(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.fileItem,
          isSelected && styles.selectedFile,
        ]}
        onPress={() => handleFilePress(item)}
        onLongPress={() => handleLongPress(item)}
      >
        <Icon 
          name={item.type === 'directory' ? 'folder' : 'insert-drive-file'} 
          size={24} 
          color={item.type === 'directory' ? '#FFB74D' : theme.colors.textSecondary}
        />
        <View style={styles.fileInfo}>
          <Text style={[styles.fileName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          {item.type === 'file' && item.size && (
            <Text style={[styles.fileSize, { color: theme.colors.textSecondary }]}>
              {formatFileSize(item.size)}
            </Text>
          )}
        </View>
        <Icon 
          name="chevron-right" 
          size={24} 
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pathBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    pathText: {
      color: theme.colors.text,
      fontSize: 14,
      flex: 1,
      marginLeft: 10,
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    toolButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
    },
    toolButtonText: {
      color: theme.colors.text,
      marginLeft: 5,
      fontSize: 12,
    },
    fileList: {
      flex: 1,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedFile: {
      backgroundColor: theme.colors.primary + '20',
    },
    fileInfo: {
      flex: 1,
      marginLeft: 15,
    },
    fileName: {
      fontSize: 16,
    },
    fileSize: {
      fontSize: 12,
      marginTop: 2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginTop: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pathBar}>
          <TouchableOpacity onPress={navigateUp}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.pathText}>{currentPath}</Text>
        </View>
        
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={handleCreateNew}>
            <Icon name="add-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.toolButtonText}>New</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton} onPress={handleImportFile}>
            <Icon name="file-upload" size={20} color={theme.colors.primary} />
            <Text style={styles.toolButtonText}>Import</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton} onPress={() => loadDirectory(currentPath)}>
            <Icon name="refresh" size={20} color={theme.colors.primary} />
            <Text style={styles.toolButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {files.length > 0 ? (
        <FlatList
          style={styles.fileList}
          data={files}
          renderItem={renderFile}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>Empty directory</Text>
        </View>
      )}
    </View>
  );
};

export default FileExplorerScreen;