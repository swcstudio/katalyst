import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Slider } from '@react-native-community/slider';
import { useIDEStore } from '../stores/ideStore';
import { useTheme } from '../providers/ThemeProvider';

const SettingsScreen: React.FC = () => {
  const { config, updateConfig, reset } = useIDEStore();
  const theme = useTheme();

  const handleThemeToggle = () => {
    updateConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            reset();
            Alert.alert('Success', 'Settings have been reset');
          }
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
      borderRadius: 12,
      marginHorizontal: 10,
      padding: 15,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    settingLabel: {
      color: theme.colors.text,
      fontSize: 16,
      flex: 1,
    },
    settingValue: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      marginRight: 10,
    },
    sliderContainer: {
      marginTop: 10,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    dangerButton: {
      backgroundColor: theme.colors.error,
    },
    infoBox: {
      backgroundColor: theme.colors.info + '20',
      padding: 15,
      borderRadius: 8,
      marginTop: 10,
    },
    infoText: {
      color: theme.colors.info,
      fontSize: 14,
      lineHeight: 20,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Theme</Text>
          <Switch
            value={config.theme === 'dark'}
            onValueChange={handleThemeToggle}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor={config.theme === 'dark' ? theme.colors.secondary : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Font Size</Text>
          <Text style={styles.settingValue}>{config.fontSize}px</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={24}
            value={config.fontSize}
            onSlidingComplete={(value) => updateConfig({ fontSize: Math.round(value) })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.secondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Editor</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Tab Size</Text>
          <Text style={styles.settingValue}>{config.tabSize} spaces</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={2}
            maximumValue={8}
            step={1}
            value={config.tabSize}
            onSlidingComplete={(value) => updateConfig({ tabSize: Math.round(value) })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.secondary}
          />
        </View>
        
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Enable LSP</Text>
          <Switch
            value={config.enableLSP}
            onValueChange={(value) => updateConfig({ enableLSP: value })}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor={config.enableLSP ? theme.colors.secondary : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sandbox</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Sandbox</Text>
          <Switch
            value={config.enableSandbox}
            onValueChange={(value) => updateConfig({ enableSandbox: value })}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor={config.enableSandbox ? theme.colors.secondary : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Memory Limit</Text>
          <Text style={styles.settingValue}>
            {Math.round(config.sandboxMemoryLimit / (1024 * 1024))} MB
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={128}
            maximumValue={2048}
            step={128}
            value={config.sandboxMemoryLimit / (1024 * 1024)}
            onSlidingComplete={(value) => 
              updateConfig({ sandboxMemoryLimit: Math.round(value) * 1024 * 1024 })
            }
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.secondary}
          />
        </View>
        
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>CPU Limit</Text>
          <Text style={styles.settingValue}>{(config.sandboxCPULimit * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={1.0}
            step={0.1}
            value={config.sandboxCPULimit}
            onSlidingComplete={(value) => updateConfig({ sandboxCPULimit: value })}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.secondary}
          />
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Sandbox provides a secure environment for code execution with resource limits.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Export</Text>
        
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Parquet Export Path</Text>
          <Text style={styles.settingValue}>
            {config.parquetOutputPath || 'Not set'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Alert.alert('Info', 'Parquet export configuration')}
        >
          <Text style={styles.buttonText}>Configure Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>0.1.0</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>WASM Runtime</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>
        
        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Cryptobox Integration</Text>
          <Text style={styles.settingValue}>Active</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;