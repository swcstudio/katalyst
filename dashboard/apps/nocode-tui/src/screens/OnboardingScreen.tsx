import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '../hooks/useTheme';
import { useSSHSetup } from '../hooks/useSSHSetup';
import { OnboardingStep } from '../components/OnboardingStep';
import { SetupCard } from '../components/SetupCard';
import { QRScanner } from '../components/QRScanner';
import { ImportOptionsStep } from './steps/ImportOptionsStep';
import { ConnectionTestStep } from './steps/ConnectionTestStep';
import { QuickConnectStep } from './steps/QuickConnectStep';
import { LoadingStep } from './steps/LoadingStep';
import { FallbackStep } from './steps/FallbackStep';
import { ManualStep } from './steps/ManualStep';
import { QRStep } from './steps/QRStep';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function OnboardingScreen({ navigation }: any) {
  const theme = useTheme();
  const sshSetup = useSSHSetup();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupMethod, setSetupMethod] = useState<string | null>(null);
  const [detectedConfigs, setDetectedConfigs] = useState<any[]>([]);
  const [importedConfigs, setImportedConfigs] = useState<any[]>([]);
  const [selectedConfigs, setSelectedConfigs] = useState<any[]>([]);

  useEffect(() => {
    // Auto-detect existing SSH configurations
    detectExistingSetup();
  }, []);

  const detectExistingSetup = async () => {
    try {
      const configs = await sshSetup.detectExistingConfigurations();
      setDetectedConfigs(configs);
      
      if (configs.length > 0) {
        // If we found existing configs, offer to import them
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Failed to detect SSH configs:', error);
    }
  };

  const handleSetupMethod = async (method: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSetupMethod(method);
    
    switch (method) {
      case 'auto':
        handleAutoSetup();
        break;
      case 'selective':
        setCurrentStep(2);
        break;
      case 'import':
        setCurrentStep(3);
        break;
      case 'qr':
        setCurrentStep(4);
        break;
      case 'manual':
        setCurrentStep(5);
        break;
      case 'test':
        setCurrentStep(6);
        break;
      case 'connect':
        setCurrentStep(7);
        break;
      case 'complete':
        navigation.replace('Main');
        break;
    }
  };

  const handleAutoSetup = async () => {
    try {
      setCurrentStep(8); // Loading step
      
      // Attempt auto-setup with detected configurations
      const result = await sshSetup.autoSetup();
      
      if (result.success && result.configs) {
        setImportedConfigs(result.configs);
        // Go to connection test
        setCurrentStep(6);
      } else {
        // Show fallback options
        setCurrentStep(9);
      }
    } catch (error) {
      Alert.alert('Setup Failed', 'Unable to complete automatic setup. Please try manual configuration.');
      setCurrentStep(5);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onContinue={() => setCurrentStep(1)} />;
      
      case 1:
        return (
          <ImportOptionsStep
            detectedConfigs={detectedConfigs}
            onSelectMethod={handleSetupMethod}
            onBack={() => setCurrentStep(0)}
          />
        );
      
      case 2:
        return (
          <ImportStep
            detectedConfigs={detectedConfigs}
            onImport={async (configs) => {
              const result = await sshSetup.importConfigurations(configs);
              if (result.success && result.configs) {
                setImportedConfigs(result.configs);
                setCurrentStep(6); // Go to connection test
              }
            }}
            onComplete={() => setCurrentStep(7)}
          />
        );
      
      case 3:
        return (
          <ImportStep
            detectedConfigs={detectedConfigs}
            onImport={async (configs) => {
              const result = await sshSetup.importConfigurations(configs);
              if (result.success && result.configs) {
                setImportedConfigs(result.configs);
                setCurrentStep(6);
              }
            }}
            onComplete={() => setCurrentStep(7)}
          />
        );
      
      case 4:
        return (
          <QRStep
            onScan={async (data) => {
              const result = await sshSetup.setupFromQR(data);
              if (result.success && result.configs) {
                setImportedConfigs(result.configs);
                setCurrentStep(7);
              }
            }}
            onComplete={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(1)}
          />
        );
      
      case 5:
        return (
          <ManualStep
            onComplete={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(1)}
          />
        );
      
      case 6:
        return (
          <ConnectionTestStep
            configs={importedConfigs}
            onComplete={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(1)}
          />
        );
      
      case 7:
        return (
          <QuickConnectStep
            configs={importedConfigs}
            onConnected={(sessionId) => navigation.replace('Main', { sessionId })}
            onBack={() => setCurrentStep(6)}
          />
        );
      
      case 8:
        return <LoadingStep />;
      
      case 9:
        return (
          <FallbackStep
            onRetry={() => setCurrentStep(1)}
            onManual={() => setCurrentStep(5)}
          />
        );
      
      default:
        return <WelcomeStep onContinue={() => setCurrentStep(1)} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary + '30', 'transparent']}
        style={styles.gradient}
      />
      
      {renderStep()}
    </View>
  );
}

// Welcome Step
function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  const theme = useTheme();
  
  return (
    <Animated.View 
      entering={FadeIn} 
      style={styles.stepContainer}
    >
      <View style={styles.heroSection}>
        <Text style={[styles.heroEmoji, { fontSize: 120 }]}>🚀</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Welcome to NoCode TUI
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Let's get your terminal connected in seconds
        </Text>
      </View>

      <View style={styles.features}>
        <FeatureItem 
          icon="⚡" 
          title="Lightning Fast" 
          description="Connect to your servers instantly" 
        />
        <FeatureItem 
          icon="🔒" 
          title="Secure" 
          description="Your keys never leave your device" 
        />
        <FeatureItem 
          icon="📱" 
          title="Mobile First" 
          description="Designed for touch interaction" 
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
        onPress={onContinue}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Detection Step
function DetectionStep({ 
  detectedConfigs, 
  onSelectMethod 
}: { 
  detectedConfigs: any[]; 
  onSelectMethod: (method: string) => void; 
}) {
  const theme = useTheme();

  return (
    <Animated.View 
      entering={SlideInRight} 
      exiting={SlideOutLeft}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Great! We found your setup
      </Text>
      
      {detectedConfigs.length > 0 && (
        <View style={styles.detectedSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Found {detectedConfigs.length} SSH configuration(s)
          </Text>
          
          {detectedConfigs.slice(0, 3).map((config, index) => (
            <BlurView key={index} intensity={20} tint="light" style={styles.configCard}>
              <Text style={[styles.configHost, { color: theme.colors.text }]}>
                {config.host}
              </Text>
              <Text style={[styles.configDetails, { color: theme.colors.textSecondary }]}>
                {config.user}@{config.hostname} • {config.keyType} key
              </Text>
            </BlurView>
          ))}
        </View>
      )}

      <View style={styles.setupOptions}>
        <SetupCard
          icon="🎯"
          title="One-Click Setup"
          description="Import everything automatically"
          recommended
          onPress={() => onSelectMethod('auto')}
        />
        
        <SetupCard
          icon="📋"
          title="Choose What to Import"
          description="Select specific servers and keys"
          onPress={() => onSelectMethod('import')}
        />
        
        <SetupCard
          icon="📱"
          title="Scan QR Code"
          description="Connect from another device"
          onPress={() => onSelectMethod('qr')}
        />
        
        <SetupCard
          icon="⚙️"
          title="Manual Setup"
          description="Configure from scratch"
          onPress={() => onSelectMethod('manual')}
        />
      </View>
    </Animated.View>
  );
}

// Import Step
function ImportStep({ 
  detectedConfigs, 
  onImport, 
  onComplete 
}: { 
  detectedConfigs: any[]; 
  onImport: (configs: any[]) => void; 
  onComplete: () => void; 
}) {
  const theme = useTheme();
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);

  const toggleConfig = (configId: string) => {
    setSelectedConfigs(prev => 
      prev.includes(configId) 
        ? prev.filter(id => id !== configId)
        : [...prev, configId]
    );
  };

  const handleImport = async () => {
    const configsToImport = detectedConfigs.filter(config => 
      selectedConfigs.includes(config.id)
    );
    
    await onImport(configsToImport);
    onComplete();
  };

  return (
    <Animated.View 
      entering={SlideInRight} 
      exiting={SlideOutLeft}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        Choose configurations to import
      </Text>

      <ScrollView style={styles.configList} showsVerticalScrollIndicator={false}>
        {detectedConfigs.map((config) => (
          <TouchableOpacity
            key={config.id}
            style={[
              styles.selectableConfig,
              {
                backgroundColor: selectedConfigs.includes(config.id)
                  ? theme.colors.primary + '20'
                  : theme.colors.surface,
                borderColor: selectedConfigs.includes(config.id)
                  ? theme.colors.primary
                  : 'transparent',
              },
            ]}
            onPress={() => toggleConfig(config.id)}
          >
            <View style={styles.configInfo}>
              <Text style={[styles.configName, { color: theme.colors.text }]}>
                {config.name || config.host}
              </Text>
              <Text style={[styles.configHost, { color: theme.colors.textSecondary }]}>
                {config.user}@{config.hostname}:{config.port || 22}
              </Text>
              <Text style={[styles.configKey, { color: theme.colors.textSecondary }]}>
                Key: {config.keyPath}
              </Text>
            </View>
            
            <View style={[
              styles.checkbox,
              {
                backgroundColor: selectedConfigs.includes(config.id)
                  ? theme.colors.primary
                  : 'transparent',
                borderColor: theme.colors.primary,
              },
            ]}>
              {selectedConfigs.includes(config.id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.importActions}>
        <TouchableOpacity
          style={[styles.selectAllButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => {
            if (selectedConfigs.length === detectedConfigs.length) {
              setSelectedConfigs([]);
            } else {
              setSelectedConfigs(detectedConfigs.map(c => c.id));
            }
          }}
        >
          <Text style={[styles.selectAllText, { color: theme.colors.text }]}>
            {selectedConfigs.length === detectedConfigs.length ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.importButton,
            {
              backgroundColor: selectedConfigs.length > 0 
                ? theme.colors.primary 
                : theme.colors.surface,
            },
          ]}
          onPress={handleImport}
          disabled={selectedConfigs.length === 0}
        >
          <Text style={[
            styles.importButtonText,
            {
              color: selectedConfigs.length > 0 
                ? 'white' 
                : theme.colors.textSecondary,
            },
          ]}>
            Import {selectedConfigs.length} Configuration{selectedConfigs.length !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// Helper Components
function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  const theme = useTheme();
  
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroEmoji: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  features: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  detectedSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  configCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  configHost: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  configDetails: {
    fontSize: 14,
  },
  setupOptions: {
    flex: 1,
  },
  configList: {
    flex: 1,
    marginBottom: 20,
  },
  selectableConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
  },
  configInfo: {
    flex: 1,
  },
  configName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  configKey: {
    fontSize: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  importActions: {
    flexDirection: 'row',
    gap: 12,
  },
  selectAllButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  importButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});