import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { sshImportService, ImportableSSHConfig } from '../services/SSHImportService';
import { nativeSSHService } from '../services/NativeSSHService';

// Re-export the interface from service for convenience
export type SSHConfig = ImportableSSHConfig;

interface SetupResult {
  success: boolean;
  message?: string;
  configs?: SSHConfig[];
}

/**
 * Custom hook for SSH setup and configuration management
 * Handles automatic detection, import, and setup of SSH configurations
 */
export function useSSHSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [detectedConfigs, setDetectedConfigs] = useState<SSHConfig[]>([]);

  /**
   * Detect existing SSH configurations from various sources
   * Uses the new import service for comprehensive detection
   */
  const detectExistingConfigurations = async (): Promise<SSHConfig[]> => {
    setIsLoading(true);
    
    try {
      const configs = await sshImportService.discoverConfigurations();
      setDetectedConfigs(configs);
      return configs;
    } catch (error) {
      console.error('Error detecting SSH configurations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Attempt automatic setup with detected configurations
   */
  const autoSetup = async (): Promise<SetupResult> => {
    try {
      setIsLoading(true);
      
      if (detectedConfigs.length === 0) {
        return {
          success: false,
          message: 'No configurations found for automatic setup',
        };
      }
      
      // Import all detected configurations
      const result = await importConfigurations(detectedConfigs);
      
      if (result.success) {
        // Test the first few connections
        const testResults = await testConnections(detectedConfigs.slice(0, 3));
        
        return {
          success: true,
          message: `Successfully imported ${detectedConfigs.length} configuration(s). ${testResults.successful} connection(s) tested successfully.`,
          configs: detectedConfigs,
        };
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: `Auto-setup failed: ${error.message}`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Import selected configurations using the import service
   */
  const importConfigurations = async (configs: SSHConfig[]): Promise<SetupResult> => {
    try {
      setIsLoading(true);
      const result = await sshImportService.importConfigurations(configs);
      
      return {
        success: result.success,
        message: result.success 
          ? `Successfully imported ${result.imported} configuration(s)`
          : `Failed to import configurations: ${result.errors.join(', ')}`,
        configs: result.configs,
      };
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error.message}`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Setup from QR code data
   */
  const setupFromQR = async (qrData: string): Promise<SetupResult> => {
    try {
      // Parse QR code data (could be JSON with server info, or SSH URL)
      let config: SSHConfig;
      
      if (qrData.startsWith('ssh://')) {
        config = parseSSHUrl(qrData);
      } else {
        // Assume JSON format
        const data = JSON.parse(qrData);
        config = {
          id: data.id || generateId(),
          name: data.name,
          host: data.host,
          hostname: data.hostname || data.host,
          user: data.user,
          port: data.port || 22,
          keyPath: data.keyPath,
          keyType: data.keyType || 'unknown',
        };
      }
      
      // Import the configuration
      return await importConfigurations([config]);
    } catch (error) {
      return {
        success: false,
        message: `QR setup failed: ${error.message}`,
      };
    }
  };

  /**
   * Test connections to verify they work using native SSH service
   */
  const testConnections = async (configs: SSHConfig[]): Promise<{ successful: number; failed: number }> => {
    let successful = 0;
    let failed = 0;
    
    for (const config of configs) {
      try {
        const testResult = await nativeSSHService.testSSHConnection({
          host: config.hostname,
          port: config.port,
          user: config.user,
          keyPath: config.keyPath,
        });
        
        if (testResult) {
          successful++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
    
    return { successful, failed };
  };

  // Helper functions
  const parseSSHConfig = (configContent: string): SSHConfig[] => {
    const configs: SSHConfig[] = [];
    const entries = configContent.split(/\nHost\s+/);
    
    entries.forEach((entry, index) => {
      if (index === 0 && !entry.startsWith('Host ')) return;
      
      const lines = entry.split('\n');
      const hostLine = lines[0].replace('Host ', '').trim();
      
      if (hostLine === '*') return; // Skip global config
      
      const config: Partial<SSHConfig> = {
        id: generateId(),
        host: hostLine,
        port: 22,
      };
      
      lines.slice(1).forEach(line => {
        const [key, ...valueParts] = line.trim().split(/\s+/);
        const value = valueParts.join(' ');
        
        switch (key?.toLowerCase()) {
          case 'hostname':
            config.hostname = value;
            break;
          case 'user':
            config.user = value;
            break;
          case 'port':
            config.port = parseInt(value) || 22;
            break;
          case 'identityfile':
            config.keyPath = value.replace('~', FileSystem.documentDirectory);
            break;
        }
      });
      
      if (config.hostname && config.user) {
        configs.push({
          ...config,
          hostname: config.hostname,
          user: config.user,
          keyType: detectKeyType(config.keyPath || ''),
        } as SSHConfig);
      }
    });
    
    return configs;
  };

  const deriveConfigFromKey = async (keyPath: string, relativePath: string): Promise<SSHConfig | null> => {
    try {
      // Try to find a matching .pub file for hostname hints
      const pubPath = `${keyPath}.pub`;
      const pubExists = await FileSystem.getInfoAsync(pubPath);
      
      let hostname = '';
      let user = 'root';
      
      if (pubExists.exists) {
        const pubContent = await FileSystem.readAsStringAsync(pubPath);
        const parts = pubContent.trim().split(' ');
        if (parts.length >= 3) {
          const comment = parts[2];
          if (comment.includes('@')) {
            [user, hostname] = comment.split('@');
          }
        }
      }
      
      if (!hostname) {
        // Generate a generic config
        hostname = 'server.example.com';
        user = 'user';
      }
      
      return {
        id: generateId(),
        name: `Config from ${relativePath}`,
        host: hostname,
        hostname,
        user,
        port: 22,
        keyPath: relativePath,
        keyType: detectKeyType(relativePath),
      };
    } catch {
      return null;
    }
  };

  const detectKeyType = (keyPath: string): 'ed25519' | 'rsa' | 'unknown' => {
    if (keyPath.includes('ed25519')) return 'ed25519';
    if (keyPath.includes('rsa')) return 'rsa';
    return 'unknown';
  };

  const generateId = (): string => {
    return `ssh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const deduplicateConfigs = (configs: SSHConfig[]): SSHConfig[] => {
    const seen = new Set();
    return configs.filter(config => {
      const key = `${config.user}@${config.hostname}:${config.port}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const parseSSHUrl = (url: string): SSHConfig => {
    const parsed = new URL(url);
    return {
      id: generateId(),
      host: parsed.hostname,
      hostname: parsed.hostname,
      user: parsed.username || 'root',
      port: parseInt(parsed.port) || 22,
      keyPath: '',
      keyType: 'unknown',
    };
  };

  const convertServerToSSHConfig = (server: any): SSHConfig => ({
    id: server.id,
    name: server.name,
    host: server.name,
    hostname: server.url.replace('ssh://', '').split('@')[1]?.split(':')[0] || '',
    user: server.url.split('@')[0]?.replace('ssh://', '') || 'root',
    port: parseInt(server.url.split(':').pop()) || 22,
    keyPath: server.defaultKey || '',
    keyType: 'unknown',
    lastUsed: server.lastConnected ? new Date(server.lastConnected) : undefined,
  });

  const extractSSHFromHistory = (history: string[]): SSHConfig[] => {
    const configs: SSHConfig[] = [];
    
    history.forEach(command => {
      const sshMatch = command.match(/ssh\s+(?:-i\s+(\S+)\s+)?(?:(\w+)@)?(\S+)/);
      if (sshMatch) {
        const [, keyPath, user, hostname] = sshMatch;
        configs.push({
          id: generateId(),
          name: `From history: ${hostname}`,
          host: hostname,
          hostname,
          user: user || 'root',
          port: 22,
          keyPath: keyPath || '',
          keyType: detectKeyType(keyPath || ''),
        });
      }
    });
    
    return configs;
  };

  const importSSHKeys = async (configs: SSHConfig[]): Promise<void> => {
    // Store key information for the app
    const keyInfo = configs.map(config => ({
      name: `Key for ${config.name || config.host}`,
      path: config.keyPath,
      type: config.keyType,
      associated_hosts: [config.hostname],
    }));
    
    await AsyncStorage.setItem('katalyst_ssh_keys', JSON.stringify(keyInfo));
  };

  const simulateConnectionTest = async (config: SSHConfig): Promise<boolean> => {
    // Simulate connection test with delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Return random success for demo (in real app, would actually test)
    return Math.random() > 0.3;
  };

  /**
   * Import SSH files manually (using document picker)
   */
  const importFromFiles = async (): Promise<SetupResult> => {
    try {
      setIsLoading(true);
      const result = await sshImportService.importFromFiles();
      
      return {
        success: result.success,
        message: result.success 
          ? `Successfully imported ${result.imported} configuration(s) from files`
          : `Failed to import from files: ${result.errors.join(', ')}`,
        configs: result.configs,
      };
    } catch (error) {
      return {
        success: false,
        message: `File import failed: ${error.message}`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if device has native SSH support
   */
  const hasNativeSupport = (): boolean => {
    return nativeSSHService.hasNativeSupport;
  };

  /**
   * Get import capabilities based on platform and native support
   */
  const getImportCapabilities = () => {
    return {
      hasNativeSupport: nativeSSHService.hasNativeSupport,
      canReadSystemSSH: nativeSSHService.hasNativeSupport,
      canImportKeys: true, // Always available via file picker
      canTestConnections: nativeSSHService.hasNativeSupport,
      canCreateKeys: nativeSSHService.hasNativeSupport,
    };
  };

  return {
    isLoading,
    detectedConfigs,
    detectExistingConfigurations,
    autoSetup,
    importConfigurations,
    setupFromQR,
    testConnections,
    importFromFiles,
    hasNativeSupport,
    getImportCapabilities,
  };
}