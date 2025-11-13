import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { nativeSSHService } from './NativeSSHService';

interface ImportableSSHConfig {
  id: string;
  source: 'config' | 'key' | 'history' | 'manual';
  name?: string;
  host: string;
  hostname: string;
  user: string;
  port: number;
  keyPath: string;
  keyType: 'ed25519' | 'rsa' | 'ecdsa' | 'unknown';
  lastUsed?: Date;
  publicKey?: string;
  fingerprint?: string;
  verified?: boolean;
}

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  configs: ImportableSSHConfig[];
}

class SSHImportService {
  private static readonly STORAGE_KEYS = {
    CONFIGS: 'katalyst_ssh_configs',
    SERVERS: 'katalyst_servers',
    KEYS: 'katalyst_ssh_keys',
    IMPORT_HISTORY: 'katalyst_import_history',
  };

  /**
   * Auto-discover SSH configurations from various sources
   */
  async discoverConfigurations(): Promise<ImportableSSHConfig[]> {
    const allConfigs: ImportableSSHConfig[] = [];

    try {
      // 1. Parse SSH config file
      const configConfigs = await this.parseSSHConfig();
      allConfigs.push(...configConfigs);

      // 2. Discover from SSH keys
      const keyConfigs = await this.discoverFromKeys();
      allConfigs.push(...keyConfigs);

      // 3. Check saved servers/history
      const historyConfigs = await this.discoverFromHistory();
      allConfigs.push(...historyConfigs);

      // 4. Deduplicate and enrich
      const uniqueConfigs = this.deduplicateConfigs(allConfigs);
      const enrichedConfigs = await this.enrichConfigurations(uniqueConfigs);

      return enrichedConfigs;
    } catch (error) {
      console.error('Failed to discover SSH configurations:', error);
      return [];
    }
  }

  /**
   * Parse SSH config file and extract host configurations
   */
  private async parseSSHConfig(): Promise<ImportableSSHConfig[]> {
    try {
      const sshConfigContent = await nativeSSHService.readSSHConfig();
      if (!sshConfigContent) return [];

      return this.parseSSHConfigContent(sshConfigContent);
    } catch (error) {
      console.warn('Failed to parse SSH config:', error);
      return [];
    }
  }

  /**
   * Parse SSH config file content into configurations
   */
  private parseSSHConfigContent(content: string): ImportableSSHConfig[] {
    const configs: ImportableSSHConfig[] = [];
    const entries = content.split(/\nHost\s+/i);

    entries.forEach((entry, index) => {
      if (index === 0 && !entry.toLowerCase().startsWith('host ')) return;
      
      const lines = entry.split('\n').map(line => line.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const hostLine = lines[0].replace(/^host\s+/i, '').trim();
      
      // Skip wildcards and global configs
      if (hostLine === '*' || hostLine.includes('*')) return;

      const config: Partial<ImportableSSHConfig> = {
        id: this.generateConfigId(),
        source: 'config',
        host: hostLine,
        port: 22,
        user: 'root',
      };

      // Parse configuration options
      lines.slice(1).forEach(line => {
        const [key, ...valueParts] = line.split(/\s+/);
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
            config.keyPath = value.replace(/^~/, '');
            break;
          case 'identitiesonly':
            // Additional metadata could be stored here
            break;
        }
      });

      // Validate required fields
      if (config.hostname && config.user) {
        configs.push({
          ...config,
          hostname: config.hostname,
          user: config.user,
          keyType: this.detectKeyType(config.keyPath || ''),
          name: `${config.user}@${config.hostname}`,
        } as ImportableSSHConfig);
      }
    });

    return configs;
  }

  /**
   * Discover configurations from available SSH keys
   */
  private async discoverFromKeys(): Promise<ImportableSSHConfig[]> {
    try {
      const keyPaths = await nativeSSHService.listSSHKeys();
      const configs: ImportableSSHConfig[] = [];

      for (const keyPath of keyPaths) {
        const keyInfo = await nativeSSHService.readSSHKey(keyPath);
        if (!keyInfo) continue;

        // Try to extract host info from public key comment or key name
        const config = await this.deriveConfigFromKey(keyPath, keyInfo);
        if (config) {
          configs.push(config);
        }
      }

      return configs;
    } catch (error) {
      console.warn('Failed to discover from keys:', error);
      return [];
    }
  }

  /**
   * Discover configurations from app history and saved data
   */
  private async discoverFromHistory(): Promise<ImportableSSHConfig[]> {
    const configs: ImportableSSHConfig[] = [];

    try {
      // Check saved servers
      const savedServers = await AsyncStorage.getItem(SSHImportService.STORAGE_KEYS.SERVERS);
      if (savedServers) {
        const servers = JSON.parse(savedServers);
        configs.push(...servers.map((server: any) => this.convertServerToConfig(server)));
      }

      // Check import history
      const importHistory = await AsyncStorage.getItem(SSHImportService.STORAGE_KEYS.IMPORT_HISTORY);
      if (importHistory) {
        const history = JSON.parse(importHistory);
        configs.push(...history.filter((config: any) => config.source === 'history'));
      }

    } catch (error) {
      console.warn('Failed to discover from history:', error);
    }

    return configs;
  }

  /**
   * Import selected configurations
   */
  async importConfigurations(configs: ImportableSSHConfig[]): Promise<ImportResult> {
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];
    const successfulConfigs: ImportableSSHConfig[] = [];

    for (const config of configs) {
      try {
        const success = await this.importSingleConfiguration(config);
        if (success) {
          imported++;
          successfulConfigs.push({ ...config, verified: true });
        } else {
          failed++;
          errors.push(`Failed to import ${config.name || config.host}`);
        }
      } catch (error) {
        failed++;
        errors.push(`Error importing ${config.name || config.host}: ${error.message}`);
      }
    }

    // Save import history
    await this.saveImportHistory(successfulConfigs);

    return {
      success: imported > 0,
      imported,
      failed,
      errors,
      configs: successfulConfigs,
    };
  }

  /**
   * Import a single SSH configuration
   */
  private async importSingleConfiguration(config: ImportableSSHConfig): Promise<boolean> {
    try {
      // 1. Import the SSH key if available
      if (config.keyPath && config.publicKey) {
        // For now, we'll store the key reference
        // In a full implementation, we'd securely store the private key
        await this.storeKeyReference(config);
      }

      // 2. Store server configuration
      await this.storeServerConfig(config);

      // 3. Test connection (optional, based on user preference)
      if (config.verified === undefined) {
        config.verified = await this.testConfiguration(config);
      }

      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }

  /**
   * Test SSH configuration
   */
  private async testConfiguration(config: ImportableSSHConfig): Promise<boolean> {
    try {
      return await nativeSSHService.testSSHConnection({
        host: config.hostname,
        port: config.port,
        user: config.user,
        keyPath: config.keyPath,
      });
    } catch (error) {
      console.warn('Failed to test configuration:', error);
      return false;
    }
  }

  /**
   * Allow user to manually import SSH files
   */
  async importFromFiles(): Promise<ImportResult> {
    try {
      // Let user pick SSH config or key files
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', '*/*'], // Allow all types since SSH files don't have specific MIME types
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return { success: false, imported: 0, failed: 0, errors: [], configs: [] };
      }

      const configs: ImportableSSHConfig[] = [];
      const errors: string[] = [];

      for (const file of result.assets) {
        try {
          const content = await FileSystem.readAsStringAsync(file.uri);
          
          if (this.looksLikeSSHConfig(content)) {
            const parsedConfigs = this.parseSSHConfigContent(content);
            configs.push(...parsedConfigs);
          } else if (this.looksLikeSSHKey(content)) {
            const keyConfig = await this.parseSSHKeyFile(file.name, content);
            if (keyConfig) configs.push(keyConfig);
          } else {
            errors.push(`Unrecognized file format: ${file.name}`);
          }
        } catch (error) {
          errors.push(`Failed to parse ${file.name}: ${error.message}`);
        }
      }

      if (configs.length > 0) {
        return await this.importConfigurations(configs);
      }

      return {
        success: false,
        imported: 0,
        failed: result.assets.length,
        errors,
        configs: [],
      };

    } catch (error) {
      return {
        success: false,
        imported: 0,
        failed: 1,
        errors: [`File import failed: ${error.message}`],
        configs: [],
      };
    }
  }

  /**
   * Helper methods
   */
  private generateConfigId(): string {
    return `ssh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private detectKeyType(keyPath: string): 'ed25519' | 'rsa' | 'ecdsa' | 'unknown' {
    const lowerPath = keyPath.toLowerCase();
    if (lowerPath.includes('ed25519')) return 'ed25519';
    if (lowerPath.includes('rsa')) return 'rsa';
    if (lowerPath.includes('ecdsa')) return 'ecdsa';
    return 'unknown';
  }

  private deduplicateConfigs(configs: ImportableSSHConfig[]): ImportableSSHConfig[] {
    const seen = new Set<string>();
    return configs.filter(config => {
      const key = `${config.user}@${config.hostname}:${config.port}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private async enrichConfigurations(configs: ImportableSSHConfig[]): Promise<ImportableSSHConfig[]> {
    // Add fingerprints, test connections, etc.
    return configs; // Placeholder
  }

  private async deriveConfigFromKey(
    keyPath: string, 
    keyInfo: { publicKey: string; keyType: string }
  ): Promise<ImportableSSHConfig | null> {
    // Try to extract hostname from key comment or derive from key name
    const name = keyPath.split('/').pop()?.replace(/^id_/, '') || 'unknown';
    
    return {
      id: this.generateConfigId(),
      source: 'key',
      name: `Key: ${name}`,
      host: 'server.example.com', // Would be derived from key metadata
      hostname: 'server.example.com',
      user: 'user',
      port: 22,
      keyPath,
      keyType: keyInfo.keyType as any,
      publicKey: keyInfo.publicKey,
    };
  }

  private convertServerToConfig(server: any): ImportableSSHConfig {
    return {
      id: server.id || this.generateConfigId(),
      source: 'history',
      name: server.name,
      host: server.name,
      hostname: this.extractHostname(server.url),
      user: this.extractUser(server.url),
      port: this.extractPort(server.url),
      keyPath: server.defaultKey || '',
      keyType: 'unknown',
      lastUsed: server.lastConnected ? new Date(server.lastConnected) : undefined,
    };
  }

  private extractHostname(url: string): string {
    return url.replace('ssh://', '').split('@')[1]?.split(':')[0] || 'localhost';
  }

  private extractUser(url: string): string {
    return url.split('@')[0]?.replace('ssh://', '') || 'root';
  }

  private extractPort(url: string): number {
    const portMatch = url.match(/:(\d+)$/);
    return portMatch ? parseInt(portMatch[1]) : 22;
  }

  private looksLikeSSHConfig(content: string): boolean {
    return content.toLowerCase().includes('host ') && 
           (content.includes('hostname') || content.includes('user'));
  }

  private looksLikeSSHKey(content: string): boolean {
    return content.includes('BEGIN') && content.includes('PRIVATE KEY');
  }

  private async parseSSHKeyFile(filename: string, content: string): Promise<ImportableSSHConfig | null> {
    // Parse private key file to create configuration
    // This is a simplified implementation
    return null;
  }

  private async storeKeyReference(config: ImportableSSHConfig): Promise<void> {
    const keyData = {
      name: config.name || config.host,
      path: config.keyPath,
      type: config.keyType,
      publicKey: config.publicKey,
      associatedHosts: [config.hostname],
      imported: true,
      timestamp: Date.now(),
    };

    const existingKeys = await AsyncStorage.getItem(SSHImportService.STORAGE_KEYS.KEYS);
    const keys = existingKeys ? JSON.parse(existingKeys) : [];
    
    keys.push(keyData);
    await AsyncStorage.setItem(SSHImportService.STORAGE_KEYS.KEYS, JSON.stringify(keys));
  }

  private async storeServerConfig(config: ImportableSSHConfig): Promise<void> {
    const serverData = {
      id: config.id,
      name: config.name || `${config.user}@${config.hostname}`,
      url: `ssh://${config.user}@${config.hostname}:${config.port}`,
      defaultKey: config.keyPath,
      imported: true,
      verified: config.verified,
      lastConnected: config.lastUsed?.toISOString(),
      source: config.source,
      timestamp: Date.now(),
    };

    const existingServers = await AsyncStorage.getItem(SSHImportService.STORAGE_KEYS.SERVERS);
    const servers = existingServers ? JSON.parse(existingServers) : [];
    
    servers.push(serverData);
    await AsyncStorage.setItem(SSHImportService.STORAGE_KEYS.SERVERS, JSON.stringify(servers));
  }

  private async saveImportHistory(configs: ImportableSSHConfig[]): Promise<void> {
    const historyEntry = {
      timestamp: Date.now(),
      imported: configs.length,
      configs: configs.map(c => ({ ...c, publicKey: undefined })), // Don't store sensitive data
    };

    const existingHistory = await AsyncStorage.getItem(SSHImportService.STORAGE_KEYS.IMPORT_HISTORY);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    history.push(historyEntry);
    // Keep only last 10 import sessions
    const recentHistory = history.slice(-10);
    
    await AsyncStorage.setItem(SSHImportService.STORAGE_KEYS.IMPORT_HISTORY, JSON.stringify(recentHistory));
  }
}

// Export singleton instance
export const sshImportService = new SSHImportService();
export { SSHImportService };
export type { ImportableSSHConfig, ImportResult };