import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Camera, CameraView } from 'expo-camera';

import { useTheme } from '../../hooks/useTheme';

interface QRStepProps {
  onScan: (data: string) => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
}

export function QRStep({ onScan, onComplete, onBack }: QRStepProps) {
  const theme = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;

    setIsScanning(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      await onScan(data);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Invalid QR Code',
        'The scanned QR code is not a valid server configuration. Please try again.',
        [
          { text: 'Try Again', onPress: () => setIsScanning(true) },
          { text: 'Cancel', onPress: onBack },
        ]
      );
    }
  };

  const handleManualEntry = () => {
    Alert.prompt(
      'Manual Entry',
      'Enter the configuration data manually:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import',
          onPress: async (text) => {
            if (text) {
              try {
                await onScan(text);
                onComplete();
              } catch (error) {
                Alert.alert('Error', 'Invalid configuration data.');
              }
            }
          }
        },
      ],
      'plain-text'
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
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
            Camera Permission
          </Text>
        </View>

        <View style={styles.permissionContent}>
          <Text style={styles.permissionEmoji}>📷</Text>
          <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionMessage, { color: theme.colors.textSecondary }]}>
            To scan QR codes, we need access to your camera. Please enable camera permissions in your device settings.
          </Text>
          
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]}
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.manualButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleManualEntry}
          >
            <Text style={[styles.manualButtonText, { color: theme.colors.text }]}>
              Enter Manually Instead
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

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
          Scan QR Code
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Scan a setup QR code from another device or server
      </Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        
        {/* Scanning overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.primary }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.primary }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.primary }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.primary }]} />
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={[styles.instructionText, { color: theme.colors.text }]}>
            {isScanning ? 'Position QR code within the frame' : 'Processing...'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.manualButton, { backgroundColor: theme.colors.surface }]}
          onPress={handleManualEntry}
        >
          <Text style={[styles.manualButtonText, { color: theme.colors.text }]}>
            Enter Configuration Manually
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    color: 'white',
  },
  actions: {
    paddingTop: 20,
  },
  manualButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});