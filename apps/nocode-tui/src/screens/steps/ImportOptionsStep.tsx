import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';
import { useSSHSetup } from '../../hooks/useSSHSetup';
import { SetupCard } from '../../components/SetupCard';

interface ImportOptionsStepProps {
  detectedConfigs: any[];
  onSelectMethod: (method: string) => void;
  onBack: () => void;
}

export function ImportOptionsStep({ 
  detectedConfigs, 
  onSelectMethod, 
  onBack 
}: ImportOptionsStepProps) {
  const theme = useTheme();
  const sshSetup = useSSHSetup();
  const [isImporting, setIsImporting] = useState(false);
  const capabilities = sshSetup.getImportCapabilities();

  const handleImportFromFiles = async () => {
    try {
      setIsImporting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await sshSetup.importFromFiles();
      
      if (result.success) {
        Alert.alert(
          'Import Successful',
          result.message,
          [{ text: 'Continue', onPress: () => onSelectMethod('complete') }]
        );
      } else {
        Alert.alert(
          'Import Failed',
          result.message,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: handleImportFromFiles },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import files. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
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
          How would you like to connect?
        </Text>
      </View>

      <ScrollView style={styles.options} showsVerticalScrollIndicator={false}>
        {/* Auto-import from detected configs */}
        {detectedConfigs.length > 0 && (
          <SetupCard
            icon="🎯"
            title="Use Detected Setup"
            description={`Import ${detectedConfigs.length} found configuration${detectedConfigs.length > 1 ? 's' : ''}`}
            recommended
            onPress={() => onSelectMethod('auto')}
          />
        )}

        {/* Import from files */}
        <SetupCard
          icon="📁"
          title="Import SSH Files"
          description="Select SSH config or key files from your device"
          onPress={handleImportFromFiles}
          loading={isImporting}
          disabled={isImporting}
        />

        {/* Selective import */}
        {detectedConfigs.length > 1 && (
          <SetupCard
            icon="✅"
            title="Choose What to Import"
            description="Select specific servers and keys"
            onPress={() => onSelectMethod('selective')}
          />
        )}

        {/* QR Code setup */}
        <SetupCard
          icon="📱"
          title="Scan QR Code"
          description="Connect by scanning a setup QR code"
          onPress={() => onSelectMethod('qr')}
        />

        {/* Manual setup */}
        <SetupCard
          icon="⚙️"
          title="Manual Configuration"
          description="Enter server details manually"
          onPress={() => onSelectMethod('manual')}
        />

        {/* Create new SSH key (if supported) */}
        {capabilities.canCreateKeys && (
          <SetupCard
            icon="🔑"
            title="Generate New SSH Key"
            description="Create a new SSH key pair for secure connections"
            onPress={() => onSelectMethod('generate')}
          />
        )}
      </ScrollView>

      {/* Capabilities info */}
      <View style={styles.capabilities}>
        <Text style={[styles.capabilitiesTitle, { color: theme.colors.textSecondary }]}>
          Available Features:
        </Text>
        <View style={styles.capabilityList}>
          <CapabilityItem 
            available={capabilities.canImportKeys}
            text="Import SSH files"
            theme={theme}
          />
          <CapabilityItem 
            available={capabilities.canTestConnections}
            text="Test connections"
            theme={theme}
          />
          <CapabilityItem 
            available={capabilities.canCreateKeys}
            text="Generate SSH keys"
            theme={theme}
          />
          <CapabilityItem 
            available={capabilities.canReadSystemSSH}
            text="Read system SSH config"
            theme={theme}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function CapabilityItem({ 
  available, 
  text, 
  theme 
}: { 
  available: boolean; 
  text: string; 
  theme: any; 
}) {
  return (
    <View style={styles.capabilityItem}>
      <Text style={[
        styles.capabilityIcon, 
        { color: available ? theme.colors.success : theme.colors.textSecondary }
      ]}>
        {available ? '✓' : '○'}
      </Text>
      <Text style={[
        styles.capabilityText, 
        { 
          color: available ? theme.colors.text : theme.colors.textSecondary,
          opacity: available ? 1 : 0.6,
        }
      ]}>
        {text}
      </Text>
    </View>
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
    marginBottom: 30,
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
  options: {
    flex: 1,
  },
  capabilities: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  capabilitiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  capabilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flex: 0.48, // Two items per row
  },
  capabilityIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  capabilityText: {
    fontSize: 12,
    flex: 1,
  },
});