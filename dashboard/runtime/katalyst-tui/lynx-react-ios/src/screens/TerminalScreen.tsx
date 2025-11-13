import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWasm } from '../providers/WasmProvider';
import { useIDEStore } from '../stores/ideStore';
import { useTheme } from '../providers/ThemeProvider';

const TerminalScreen: React.FC = () => {
  const { runTerminalCommand } = useWasm();
  const { terminalHistory, addToTerminalHistory } = useIDEStore();
  const theme = useTheme();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Display welcome message
    setOutput(['Welcome to Lynx Terminal', 'Type "help" for available commands', '']);
  }, []);

  const executeCommand = async () => {
    if (!input.trim()) return;

    const command = input.trim();
    addToTerminalHistory(command);
    
    // Add command to output
    setOutput(prev => [...prev, `$ ${command}`]);
    
    try {
      const result = await runTerminalCommand(command);
      setOutput(prev => [...prev, result, '']);
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error}`, '']);
    }
    
    setInput('');
    setHistoryIndex(-1);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (terminalHistory.length === 0) return;

    let newIndex = historyIndex;
    
    if (direction === 'up') {
      if (historyIndex === -1) {
        newIndex = terminalHistory.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      }
    } else {
      if (historyIndex < terminalHistory.length - 1) {
        newIndex = historyIndex + 1;
      } else {
        newIndex = -1;
        setInput('');
        return;
      }
    }
    
    if (newIndex >= 0 && newIndex < terminalHistory.length) {
      setInput(terminalHistory[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const clearTerminal = () => {
    setOutput([]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    outputContainer: {
      flex: 1,
      padding: 10,
    },
    outputText: {
      color: theme.colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: theme.sizes.fontSize,
      lineHeight: theme.sizes.fontSize * 1.5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    prompt: {
      color: theme.colors.secondary,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: theme.sizes.fontSize,
      marginRight: 5,
    },
    input: {
      flex: 1,
      color: theme.colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: theme.sizes.fontSize,
      padding: 5,
    },
    historyButtons: {
      flexDirection: 'row',
      marginLeft: 10,
    },
    historyButton: {
      padding: 5,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Terminal</Text>
        <TouchableOpacity onPress={clearTerminal}>
          <Icon name="clear-all" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.outputContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {output.map((line, index) => (
          <Text key={index} style={styles.outputText}>
            {line}
          </Text>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>$</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={executeCommand}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          placeholder="Enter command..."
          placeholderTextColor={theme.colors.textSecondary}
        />
        <View style={styles.historyButtons}>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => navigateHistory('up')}
          >
            <Icon name="keyboard-arrow-up" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => navigateHistory('down')}
          >
            <Icon name="keyboard-arrow-down" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TerminalScreen;