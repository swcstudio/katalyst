import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';

interface ManualStepProps {
  onComplete: () => void;
  onBack: () => void;
}

interface ServerConfig {
  name: string;
  host: string;
  port: string;
  user: string;
  keyPath: string;
}

export function ManualStep({ onComplete, onBack }: ManualStepProps) {
  const theme = useTheme();
  const [config, setConfig] = useState<ServerConfig>({
    name: '',
    host: '',
    port: '22',
    user: 'root',
    keyPath: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Validate required fields
    if (!config.host || !config.user) {
      Alert.alert('Missing Information', 'Please enter at least the host and username.');
      return;
    }

    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Here we would save the configuration
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View 
        entering={SlideInRight} 
        exiting={SlideOutLeft}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            onPress={onBack}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Manual Setup
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Enter your server connection details manually
        </Text>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <FormField
            label="Connection Name"
            placeholder="My Server"
            value={config.name}
            onChangeText={(name) => setConfig(prev => ({ ...prev, name }))}
            theme={theme}
          />

          <FormField
            label="Hostname"
            placeholder="server.example.com"
            value={config.host}
            onChangeText={(host) => setConfig(prev => ({ ...prev, host }))}
            theme={theme}
            required
          />

          <FormField
            label="Username"
            placeholder="root"
            value={config.user}
            onChangeText={(user) => setConfig(prev => ({ ...prev, user }))}
            theme={theme}
            required
          />

          <FormField
            label="Port"
            placeholder="22"
            value={config.port}
            onChangeText={(port) => setConfig(prev => ({ ...prev, port }))}
            theme={theme}
            keyboardType="numeric"
          />

          <FormField
            label="SSH Key Path (Optional)"
            placeholder="/path/to/private/key"
            value={config.keyPath}
            onChangeText={(keyPath) => setConfig(prev => ({ ...prev, keyPath }))}
            theme={theme}
          />

          <View style={styles.presets}>
            <Text style={[styles.presetsTitle, { color: theme.colors.text }]}>
              Quick Presets:
            </Text>
            <View style={styles.presetButtons}>
              <PresetButton
                label="Ubuntu Server"
                onPress={() => setConfig(prev => ({ 
                  ...prev, 
                  user: 'ubuntu',
                  port: '22',
                }))}
                theme={theme}
              />
              <PresetButton
                label="CentOS/RHEL"
                onPress={() => setConfig(prev => ({ 
                  ...prev, 
                  user: 'centos',
                  port: '22',
                }))}
                theme={theme}
              />
              <PresetButton
                label="Debian"
                onPress={() => setConfig(prev => ({ 
                  ...prev, 
                  user: 'debian',
                  port: '22',
                }))}
                theme={theme}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: config.host && config.user
                  ? theme.colors.primary
                  : theme.colors.surface,
              },
            ]}
            onPress={handleSave}
            disabled={isLoading || !config.host || !config.user}
          >
            <Text style={[
              styles.saveButtonText,
              {
                color: config.host && config.user
                  ? 'white'
                  : theme.colors.textSecondary,
              },
            ]}>
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  theme,
  required = false,
  keyboardType = 'default',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  theme: any;
  required?: boolean;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.fieldInput,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: value ? theme.colors.primary : 'transparent',
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

function PresetButton({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.presetButton, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <Text style={[styles.presetButtonText, { color: theme.colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    flex: 1,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  fieldInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
  },
  presets: {
    marginTop: 32,
    marginBottom: 16,
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    paddingTop: 20,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});