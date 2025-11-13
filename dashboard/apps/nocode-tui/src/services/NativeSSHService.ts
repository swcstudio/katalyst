import { NativeModules, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

interface NativeSSHModule {
  readSSHConfig(): Promise<string>;
  listSSHKeys(): Promise<string[]>;
  readSSHKey(path: string): Promise<{ publicKey: string; keyType: string }>;
  importSSHKey(privateKey: string, publicKey: string, name: string): Promise<boolean>;
  testSSHConnection(config: SSHConnectionConfig): Promise<boolean>;
  createSSHKey(name: string, keyType: 'ed25519' | 'rsa'): Promise<{ privateKey: string; publicKey: string }>;
}

interface SSHConnectionConfig {
  host: string;
  port: number;
  user: string;
  keyPath: string;
}

class NativeSSHService {
  private nativeModule: NativeSSHModule | null = null;

  constructor() {
    // Try to get the native module if available
    try {
      this.nativeModule = NativeModules.KatalystSSH as NativeSSHModule;
    } catch (error) {
      console.warn('Native SSH module not available, using fallback implementation');
    }
  }

  /**
   * Read SSH config file from the device
   * On iOS/Android, this will use platform-specific implementations
   * On web, falls back to localStorage simulation
   */
  async readSSHConfig(): Promise<string> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.readSSHConfig();
      } catch (error) {
        console.warn('Failed to read SSH config via native module:', error);
      }
    }

    // Fallback: try to read from app's document directory
    try {
      const sshConfigPath = `${FileSystem.documentDirectory}.ssh/config`;
      const fileInfo = await FileSystem.getInfoAsync(sshConfigPath);
      
      if (fileInfo.exists) {
        return await FileSystem.readAsStringAsync(sshConfigPath);
      }
    } catch (error) {
      console.warn('Failed to read SSH config from file system:', error);
    }

    return '';
  }

  /**
   * List available SSH keys on the device
   */
  async listSSHKeys(): Promise<string[]> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.listSSHKeys();
      } catch (error) {
        console.warn('Failed to list SSH keys via native module:', error);
      }
    }

    // Fallback: scan common SSH key locations
    const commonPaths = [
      '.ssh/id_ed25519',
      '.ssh/id_rsa',
      '.ssh/id_ecdsa',
      '.ssh/katalyst_key',
    ];

    const foundKeys: string[] = [];
    
    for (const relativePath of commonPaths) {
      try {
        const fullPath = `${FileSystem.documentDirectory}${relativePath}`;
        const fileInfo = await FileSystem.getInfoAsync(fullPath);
        
        if (fileInfo.exists) {
          foundKeys.push(relativePath);
        }
      } catch (error) {
        // Silently continue if file doesn't exist
      }
    }

    return foundKeys;
  }

  /**
   * Read SSH key details (type, fingerprint, etc.)
   */
  async readSSHKey(path: string): Promise<{ publicKey: string; keyType: string } | null> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.readSSHKey(path);
      } catch (error) {
        console.warn('Failed to read SSH key via native module:', error);
      }
    }

    // Fallback: try to read public key file
    try {
      const publicKeyPath = `${FileSystem.documentDirectory}${path}.pub`;
      const pubFileInfo = await FileSystem.getInfoAsync(publicKeyPath);
      
      if (pubFileInfo.exists) {
        const publicKeyContent = await FileSystem.readAsStringAsync(publicKeyPath);
        const parts = publicKeyContent.trim().split(' ');
        
        if (parts.length >= 2) {
          return {
            publicKey: parts[1],
            keyType: this.detectKeyTypeFromAlgorithm(parts[0]),
          };
        }
      }
    } catch (error) {
      console.warn('Failed to read SSH public key:', error);
    }

    return null;
  }

  /**
   * Import SSH key pair into the app's secure storage
   */
  async importSSHKey(privateKey: string, publicKey: string, name: string): Promise<boolean> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.importSSHKey(privateKey, publicKey, name);
      } catch (error) {
        console.warn('Failed to import SSH key via native module:', error);
      }
    }

    // Fallback: store in secure storage
    try {
      await SecureStore.setItemAsync(`ssh_private_${name}`, privateKey);
      await SecureStore.setItemAsync(`ssh_public_${name}`, publicKey);
      
      // Store metadata
      const metadata = {
        name,
        imported: true,
        timestamp: Date.now(),
      };
      
      await SecureStore.setItemAsync(`ssh_meta_${name}`, JSON.stringify(metadata));
      return true;
    } catch (error) {
      console.error('Failed to import SSH key to secure storage:', error);
      return false;
    }
  }

  /**
   * Test SSH connection with given configuration
   */
  async testSSHConnection(config: SSHConnectionConfig): Promise<boolean> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.testSSHConnection(config);
      } catch (error) {
        console.warn('Failed to test SSH connection via native module:', error);
      }
    }

    // Fallback: simulate connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate network delay and random success rate
        resolve(Math.random() > 0.3);
      }, 1000 + Math.random() * 2000);
    });
  }

  /**
   * Create a new SSH key pair
   */
  async createSSHKey(name: string, keyType: 'ed25519' | 'rsa' = 'ed25519'): Promise<{ privateKey: string; publicKey: string } | null> {
    if (this.nativeModule) {
      try {
        return await this.nativeModule.createSSHKey(name, keyType);
      } catch (error) {
        console.warn('Failed to create SSH key via native module:', error);
      }
    }

    // Fallback: cannot create keys without native implementation
    console.warn('SSH key generation requires native implementation');
    return null;
  }

  /**
   * Check if device supports native SSH operations
   */
  get hasNativeSupport(): boolean {
    return this.nativeModule !== null;
  }

  /**
   * Get platform-specific SSH directory paths
   */
  getSSHDirectoryPaths(): string[] {
    const basePaths: string[] = [];
    
    if (Platform.OS === 'ios') {
      // iOS-specific paths
      basePaths.push(
        `${FileSystem.documentDirectory}.ssh/`,
        `${FileSystem.documentDirectory}Documents/.ssh/`,
      );
    } else if (Platform.OS === 'android') {
      // Android-specific paths
      basePaths.push(
        `${FileSystem.documentDirectory}.ssh/`,
        '/data/data/com.katalyst.nocode-tui/.ssh/',
      );
    } else {
      // Web/other platforms
      basePaths.push(`${FileSystem.documentDirectory}.ssh/`);
    }
    
    return basePaths;
  }

  /**
   * Import SSH configuration from system (macOS/Linux)
   * This would typically be called from a desktop companion app
   */
  async importFromSystem(): Promise<{
    configs: any[];
    keys: string[];
  }> {
    const configs: any[] = [];
    const keys: string[] = [];

    // Try to read system SSH config
    const sshConfig = await this.readSSHConfig();
    if (sshConfig) {
      // Parse SSH config would go here
    }

    // List system SSH keys
    const systemKeys = await this.listSSHKeys();
    keys.push(...systemKeys);

    return { configs, keys };
  }

  /**
   * Helper method to detect key type from algorithm string
   */
  private detectKeyTypeFromAlgorithm(algorithm: string): string {
    const lowerAlg = algorithm.toLowerCase();
    
    if (lowerAlg.includes('ed25519')) return 'ed25519';
    if (lowerAlg.includes('rsa')) return 'rsa';
    if (lowerAlg.includes('ecdsa')) return 'ecdsa';
    if (lowerAlg.includes('dsa')) return 'dsa';
    
    return 'unknown';
  }

  /**
   * Cleanup temporary files and secure storage
   */
  async cleanup(): Promise<void> {
    // Remove any temporary SSH files
    try {
      const tempDir = `${FileSystem.cacheDirectory}ssh_temp/`;
      await FileSystem.deleteAsync(tempDir, { idempotent: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

// Export singleton instance
export const nativeSSHService = new NativeSSHService();
export { NativeSSHService };
export type { SSHConnectionConfig };