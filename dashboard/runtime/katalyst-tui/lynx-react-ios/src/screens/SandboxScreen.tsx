import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useWasm } from '../providers/WasmProvider';
import { useIDEStore } from '../stores/ideStore';
import { useTheme } from '../providers/ThemeProvider';

const SandboxScreen: React.FC = () => {
  const { executeCode } = useWasm();
  const { addSandboxResult } = useIDEStore();
  const theme = useTheme();
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Rust', value: 'rust' },
    { label: 'Go', value: 'go' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
  ];

  const codeTemplates: { [key: string]: string } = {
    javascript: `// JavaScript Example
console.log("Hello from sandbox!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`,
    
    typescript: `// TypeScript Example
interface Person {
  name: string;
  age: number;
}

const greet = (person: Person): string => {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
};

const user: Person = { name: "Alice", age: 30 };
console.log(greet(user));`,
    
    python: `# Python Example
def hello_world():
    print("Hello from Python sandbox!")

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

hello_world()
print(f"Factorial(5): {factorial(5)}")`,
    
    rust: `// Rust Example
fn main() {
    println!("Hello from Rust sandbox!");
    
    let result = calculate_sum(5);
    println!("Sum from 1 to 5: {}", result);
}

fn calculate_sum(n: i32) -> i32 {
    (1..=n).sum()
}`,
    
    go: `// Go Example
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go sandbox!")
    
    result := fibonacci(10)
    fmt.Printf("Fibonacci(10): %d\\n", result)
}

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}`,
  };

  const handleExecute = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter some code to execute');
      return;
    }

    setExecuting(true);
    setOutput('');
    const startTime = Date.now();

    try {
      const result = await executeCode(code, language);
      const parsed = JSON.parse(result);
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      const outputText = [
        '=== Execution Result ===',
        parsed.stdout || '(no output)',
        parsed.stderr ? `\nErrors:\n${parsed.stderr}` : '',
        `\nExit Code: ${parsed.exit_code}`,
        `Execution Time: ${parsed.execution_time_ms}ms`,
        `Memory Used: ${formatBytes(parsed.memory_used_bytes)}`,
      ].join('\n');
      
      setOutput(outputText);
      
      // Save to history
      addSandboxResult(`${language}_${Date.now()}`, {
        language,
        code,
        result: parsed,
        timestamp: new Date(),
      });
    } catch (error) {
      setOutput(`Error executing code:\n${error}`);
    } finally {
      setExecuting(false);
    }
  };

  const loadTemplate = () => {
    const template = codeTemplates[language];
    if (template) {
      setCode(template);
    }
  };

  const clearAll = () => {
    setCode('');
    setOutput('');
    setExecutionTime(null);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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
    languageSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    languageLabel: {
      color: theme.colors.text,
      marginRight: 10,
    },
    picker: {
      flex: 1,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
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
    editorSection: {
      flex: 1,
      padding: 10,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 5,
    },
    codeInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontFamily: 'Menlo',
      fontSize: theme.sizes.fontSize,
      padding: 10,
      borderRadius: 8,
      textAlignVertical: 'top',
    },
    outputSection: {
      height: 200,
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    outputText: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontFamily: 'Menlo',
      fontSize: 12,
      padding: 10,
      borderRadius: 8,
    },
    executeButton: {
      backgroundColor: theme.colors.success,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      margin: 10,
      borderRadius: 8,
    },
    executeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    executingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusBar: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.languageSelector}>
          <Text style={styles.languageLabel}>Language:</Text>
          <Picker
            selectedValue={language}
            onValueChange={setLanguage}
            style={styles.picker}
          >
            {languages.map(lang => (
              <Picker.Item 
                key={lang.value} 
                label={lang.label} 
                value={lang.value}
                color={theme.colors.text}
              />
            ))}
          </Picker>
        </View>
        
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={loadTemplate}>
            <Icon name="code" size={20} color={theme.colors.primary} />
            <Text style={styles.toolButtonText}>Template</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton} onPress={clearAll}>
            <Icon name="clear" size={20} color={theme.colors.warning} />
            <Text style={styles.toolButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.editorSection}>
        <Text style={styles.sectionTitle}>Code Editor</Text>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={setCode}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          placeholder={`Enter ${language} code here...`}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <TouchableOpacity 
        style={styles.executeButton}
        onPress={handleExecute}
        disabled={executing}
      >
        {executing ? (
          <View style={styles.executingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.executeButtonText}>Executing...</Text>
          </View>
        ) : (
          <>
            <Icon name="play-arrow" size={24} color="#fff" />
            <Text style={styles.executeButtonText}>Execute</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.outputSection}>
        <Text style={styles.sectionTitle}>Output</Text>
        <ScrollView>
          <Text style={styles.outputText}>{output || 'Output will appear here...'}</Text>
        </ScrollView>
      </View>

      {executionTime !== null && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            Total execution time: {executionTime}ms
          </Text>
        </View>
      )}
    </View>
  );
};

export default SandboxScreen;