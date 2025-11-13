import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Animated, { 
  SlideInRight, 
  SlideOutLeft,
  FadeIn,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';
import { useSSHSetup, SSHConfig } from '../../hooks/useSSHSetup';

interface ConnectionTestStepProps {
  configs: SSHConfig[];
  onComplete: () => void;
  onBack: () => void;
}

interface TestResult {
  configId: string;
  status: 'testing' | 'success' | 'failed' | 'pending';
  latency?: number;
  error?: string;
}

export function ConnectionTestStep({ 
  configs, 
  onComplete, 
  onBack 
}: ConnectionTestStepProps) {
  const theme = useTheme();
  const sshSetup = useSSHSetup();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [isTestingAll, setIsTestingAll] = useState(false);

  // Animation values
  const progressValue = useSharedValue(0);

  useEffect(() => {
    // Initialize test results
    setTestResults(
      configs.map(config => ({
        configId: config.id,
        status: 'pending',
      }))
    );
  }, [configs]);

  const testSingleConnection = async (configIndex: number): Promise<void> => {
    const config = configs[configIndex];
    if (!config) return;

    setTestResults(prev => prev.map(result => 
      result.configId === config.id 
        ? { ...result, status: 'testing' }
        : result
    ));

    const startTime = Date.now();
    
    try {
      const success = await sshSetup.testConnections([config]);
      const latency = Date.now() - startTime;

      await Haptics.impactAsync(
        success.successful > 0 
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );

      setTestResults(prev => prev.map(result => 
        result.configId === config.id 
          ? { 
              ...result, 
              status: success.successful > 0 ? 'success' : 'failed',
              latency: success.successful > 0 ? latency : undefined,
              error: success.failed > 0 ? 'Connection failed' : undefined,
            }
          : result
      ));
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      setTestResults(prev => prev.map(result => 
        result.configId === config.id 
          ? { 
              ...result, 
              status: 'failed',
              error: error.message || 'Unknown error',
            }
          : result
      ));
    }
  };

  const testAllConnections = async (): Promise<void> => {
    setIsTestingAll(true);
    setCurrentTestIndex(0);

    for (let i = 0; i < configs.length; i++) {
      setCurrentTestIndex(i);
      progressValue.value = withSpring((i + 1) / configs.length);
      await testSingleConnection(i);
      
      // Small delay between tests for better UX
      if (i < configs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setCurrentTestIndex(-1);
    setIsTestingAll(false);
    
    // Success haptic when all tests complete
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const skipTests = (): void => {
    setTestResults(prev => prev.map(result => ({
      ...result,
      status: 'pending',
    })));
    onComplete();
  };

  const retryFailedTests = async (): void => {
    const failedConfigs = configs.filter(config => {
      const result = testResults.find(r => r.configId === config.id);
      return result?.status === 'failed';
    });

    if (failedConfigs.length === 0) return;

    for (const config of failedConfigs) {
      const index = configs.findIndex(c => c.id === config.id);
      if (index >= 0) {
        await testSingleConnection(index);
      }
    }
  };

  const getTestSummary = () => {
    const successful = testResults.filter(r => r.status === 'success').length;
    const failed = testResults.filter(r => r.status === 'failed').length;
    const pending = testResults.filter(r => r.status === 'pending').length;
    const testing = testResults.filter(r => r.status === 'testing').length;

    return { successful, failed, pending, testing };
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const summary = getTestSummary();
  const allTestsComplete = summary.pending === 0 && summary.testing === 0;
  const hasFailures = summary.failed > 0;

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
          Test Connections
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Let's verify your imported configurations work correctly
      </Text>

      {/* Progress Bar */}
      {isTestingAll && (
        <Animated.View entering={FadeIn} style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface }]}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { backgroundColor: theme.colors.primary },
                progressStyle
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Testing {currentTestIndex + 1} of {configs.length}
          </Text>
        </Animated.View>
      )}

      {/* Test Results */}
      <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
        {configs.map((config, index) => {
          const result = testResults.find(r => r.configId === config.id);
          return (
            <ConnectionResultCard
              key={config.id}
              config={config}
              result={result}
              theme={theme}
              onRetest={() => testSingleConnection(index)}
            />
          );
        })}
      </ScrollView>

      {/* Summary */}
      {allTestsComplete && (
        <Animated.View entering={FadeIn} style={styles.summary}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
            Test Results
          </Text>
          <View style={styles.summaryStats}>
            <StatItem 
              icon="✅" 
              count={summary.successful} 
              label="Successful"
              color={theme.colors.success}
            />
            <StatItem 
              icon="❌" 
              count={summary.failed} 
              label="Failed"
              color={theme.colors.error}
            />
          </View>
        </Animated.View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {!isTestingAll && summary.pending > 0 && (
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: theme.colors.primary }]}
            onPress={testAllConnections}
          >
            <Text style={styles.testButtonText}>Test All Connections</Text>
          </TouchableOpacity>
        )}

        {hasFailures && allTestsComplete && (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.warning }]}
            onPress={retryFailedTests}
          >
            <Text style={styles.retryButtonText}>Retry Failed Tests</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: theme.colors.surface }]}
          onPress={allTestsComplete ? onComplete : skipTests}
        >
          <Text style={[styles.skipButtonText, { color: theme.colors.text }]}>
            {allTestsComplete ? 'Continue' : 'Skip Tests'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function ConnectionResultCard({ 
  config, 
  result, 
  theme,
  onRetest 
}: {
  config: SSHConfig;
  result?: TestResult;
  theme: any;
  onRetest: () => void;
}) {
  const getStatusIcon = () => {
    switch (result?.status) {
      case 'testing': return '🔄';
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (result?.status) {
      case 'success': return theme.colors.success;
      case 'failed': return theme.colors.error;
      case 'testing': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardIcon, { color: getStatusColor() }]}>
          {getStatusIcon()}
        </Text>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            {config.name || `${config.user}@${config.hostname}`}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
            {config.hostname}:{config.port}
          </Text>
        </View>
        {result?.latency && (
          <Text style={[styles.latency, { color: theme.colors.success }]}>
            {result.latency}ms
          </Text>
        )}
      </View>

      {result?.status === 'testing' && (
        <View style={styles.testingIndicator}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.testingText, { color: theme.colors.textSecondary }]}>
            Testing connection...
          </Text>
        </View>
      )}

      {result?.error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {result.error}
        </Text>
      )}

      {result?.status === 'failed' && (
        <TouchableOpacity 
          style={[styles.retestButton, { borderColor: theme.colors.primary }]}
          onPress={onRetest}
        >
          <Text style={[styles.retestButtonText, { color: theme.colors.primary }]}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function StatItem({ 
  icon, 
  count, 
  label, 
  color 
}: { 
  icon: string; 
  count: number; 
  label: string; 
  color: string; 
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statIcon, { color }]}>{icon}</Text>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
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
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  resultsList: {
    flex: 1,
    marginBottom: 20,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  latency: {
    fontSize: 12,
    fontWeight: '500',
  },
  testingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  testingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  retestButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  retestButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  summary: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  actions: {
    gap: 12,
  },
  testButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  skipButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});