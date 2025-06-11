export interface PulsarMessage {
  topic: string;
  payload: any;
  timestamp: number;
}

export interface PulsarConfig {
  serviceUrl: string;
  tenant: string;
  namespace: string;
}

export class PulsarClient {
  private config: PulsarConfig;
  private connected: boolean = false;

  constructor(config: PulsarConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      console.log(`Connecting to Pulsar at ${this.config.serviceUrl}`);
      this.connected = true;
      console.log('✅ Pulsar client connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Pulsar:', error);
      throw error;
    }
  }

  async publish(topic: string, payload: any): Promise<void> {
    if (!this.connected) {
      throw new Error('Pulsar client not connected');
    }

    const message: PulsarMessage = {
      topic,
      payload,
      timestamp: Date.now()
    };

    console.log(`Publishing message to topic: ${topic}`, message);
  }

  async subscribe(topic: string, callback: (message: PulsarMessage) => void): Promise<void> {
    if (!this.connected) {
      throw new Error('Pulsar client not connected');
    }

    console.log(`Subscribing to topic: ${topic}`);
    
    setTimeout(() => {
      const mockMessage: PulsarMessage = {
        topic,
        payload: { type: 'welcome', data: 'Hello from React on Rust!' },
        timestamp: Date.now()
      };
      callback(mockMessage);
    }, 1000);
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('Pulsar client disconnected');
  }
}

export const createPulsarClient = (config: PulsarConfig): PulsarClient => {
  return new PulsarClient(config);
};
