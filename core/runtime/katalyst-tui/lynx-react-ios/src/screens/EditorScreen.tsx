import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useWasm } from '../providers/WasmProvider';
import { useIDEStore } from '../stores/ideStore';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/styles/hljs';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface EditorScreenProps {
  route: {
    params?: {
      filePath?: string;
    };
  };
  navigation: any;
}

const EditorScreen: React.FC<EditorScreenProps> = ({ route, navigation }) => {
  const { filePath } = route.params || {};
  const { openFile, saveFile, getCompletions } = useWasm();
  const { currentFile, setCurrentFile, addRecentFile } = useIDEStore();
  
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCompletions, setShowCompletions] = useState(false);
  const [completions, setCompletions] = useState<any[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  
  const editorRef = useRef<TextInput>(null);

  useEffect(() => {
    if (filePath) {
      loadFile(filePath);
    }
  }, [filePath]);

  useEffect(() => {
    // Set up navigation options with save button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} disabled={!isDirty || saving}>
          <Icon 
            name="save" 
            size={24} 
            color={isDirty ? '#4CAF50' : '#666'} 
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [isDirty, saving]);

  const loadFile = async (path: string) => {
    try {
      setLoading(true);
      const fileContent = await openFile(path);
      setContent(fileContent);
      setCurrentFile(path);
      addRecentFile(path);
      setLanguage(detectLanguage(path));
      setIsDirty(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentFile) {
      Alert.alert('Error', 'No file to save');
      return;
    }

    try {
      setSaving(true);
      await saveFile(currentFile, content);
      setIsDirty(false);
      Alert.alert('Success', 'File saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handleTextChange = (text: string) => {
    setContent(text);
    setIsDirty(true);
  };

  const handleSelectionChange = (event: any) => {
    const { start } = event.nativeEvent.selection;
    setCursorPosition(start);
  };

  const requestCompletions = async () => {
    if (!currentFile) return;

    try {
      const completionData = await getCompletions(currentFile, cursorPosition);
      const parsed = JSON.parse(completionData);
      setCompletions(parsed.items || []);
      setShowCompletions(true);
    } catch (error) {
      console.error('Failed to get completions:', error);
    }
  };

  const insertCompletion = (completion: any) => {
    const before = content.substring(0, cursorPosition);
    const after = content.substring(cursorPosition);
    const newContent = before + (completion.insert_text || completion.label) + after;
    setContent(newContent);
    setShowCompletions(false);
    setIsDirty(true);
  };

  const detectLanguage = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      rs: 'rust',
      go: 'go',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      rb: 'ruby',
      php: 'php',
      swift: 'swift',
      kt: 'kotlin',
      dart: 'dart',
      r: 'r',
      sql: 'sql',
      sh: 'bash',
      bash: 'bash',
      zsh: 'bash',
      fish: 'bash',
      ps1: 'powershell',
      json: 'json',
      xml: 'xml',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      less: 'less',
      md: 'markdown',
      yaml: 'yaml',
      yml: 'yaml',
      toml: 'toml',
      ini: 'ini',
      dockerfile: 'dockerfile',
      makefile: 'makefile',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading file...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.navigate('FileExplorer')}>
          <Icon name="folder-open" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.fileName}>{currentFile || 'Untitled'}</Text>
        <TouchableOpacity onPress={requestCompletions}>
          <Icon name="code" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.editorContainer} horizontal>
        <View style={styles.editorWrapper}>
          <View style={styles.lineNumbers}>
            {content.split('\n').map((_, index) => (
              <Text key={index} style={styles.lineNumber}>
                {index + 1}
              </Text>
            ))}
          </View>
          
          <TextInput
            ref={editorRef}
            style={styles.editor}
            value={content}
            onChangeText={handleTextChange}
            onSelectionChange={handleSelectionChange}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            keyboardType="default"
            textAlignVertical="top"
            placeholder="Start coding..."
            placeholderTextColor="#666"
          />
        </View>
      </ScrollView>

      {showCompletions && completions.length > 0 && (
        <View style={styles.completionsContainer}>
          <ScrollView>
            {completions.map((completion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.completionItem}
                onPress={() => insertCompletion(completion)}
              >
                <Text style={styles.completionLabel}>{completion.label}</Text>
                <Text style={styles.completionKind}>{completion.kind}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Line {Math.max(1, content.substring(0, cursorPosition).split('\n').length)} • 
          {language} • 
          {isDirty ? ' Modified' : ' Saved'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Terminal')}>
          <Icon name="terminal" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e3e',
  },
  fileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  editorWrapper: {
    flexDirection: 'row',
    minWidth: '100%',
  },
  lineNumbers: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#3e3e3e',
  },
  lineNumber: {
    color: '#858585',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  editor: {
    flex: 1,
    color: '#d4d4d4',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 10,
    lineHeight: 20,
  },
  completionsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    maxHeight: 200,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3e3e3e',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  completionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e3e',
  },
  completionLabel: {
    color: '#d4d4d4',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  completionKind: {
    color: '#858585',
    fontSize: 12,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007ACC',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default EditorScreen;