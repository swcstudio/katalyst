import { useEffect, useState } from 'react';

export interface PulsarMessage {
  topic: string;
  payload: any;
  timestamp: string;
}

export interface PulsarClient {
  connect(): Promise<void>;
  disconnect(): void;
  publish(topic: string, payload: any): Promise<void>;
  subscribe(topic: string, callback: (message: PulsarMessage) => void): Promise<void>;
}

export const createPulsarClient = (config: {
  serviceUrl: string;
  tenant: string;
  namespace: string;
}): PulsarClient => {
  let isConnected = false;
  const subscribers: Map<string, (message: PulsarMessage) => void> = new Map();

  return {
    async connect() {
      console.log(`Connecting to Pulsar at ${config.serviceUrl}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      isConnected = true;
      console.log('Connected to Pulsar');
    },

    disconnect() {
      isConnected = false;
      subscribers.clear();
      console.log('Disconnected from Pulsar');
    },

    async publish(topic: string, payload: any) {
      if (!isConnected) {
        throw new Error('Not connected to Pulsar');
      }

      const message: PulsarMessage = {
        topic,
        payload,
        timestamp: new Date().toISOString(),
      };

      console.log('Publishing message:', message);

      subscribers.forEach((callback, subscribedTopic) => {
        if (subscribedTopic === topic || subscribedTopic.includes('*')) {
          setTimeout(() => callback(message), 100);
        }
      });
    },

    async subscribe(topic: string, callback: (message: PulsarMessage) => void) {
      if (!isConnected) {
        throw new Error('Not connected to Pulsar');
      }

      subscribers.set(topic, callback);
      console.log(`Subscribed to topic: ${topic}`);
    },
  };
};

export const usePulsar = () => {
  const [client, setClient] = useState<PulsarClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<PulsarMessage[]>([]);

  useEffect(() => {
    const pulsarClient = createPulsarClient({
      serviceUrl: 'pulsar://localhost:6650',
      tenant: 'sse',
      namespace: 'reactonrust',
    });

    const initClient = async () => {
      try {
        await pulsarClient.connect();
        setClient(pulsarClient);
        setConnected(true);

        await pulsarClient.subscribe('sse/reactonrust/events', (message) => {
          setMessages((prev: PulsarMessage[]) => [...prev, message]);
        });
      } catch (error) {
        console.error('Failed to initialize Pulsar client:', error);
      }
    };

    initClient();

    return () => {
      if (pulsarClient) {
        pulsarClient.disconnect();
      }
    };
  }, []);

  const publishMessage = async (topic: string, payload: any) => {
    if (client && connected) {
      await client.publish(topic, payload);
    }
  };

  return {
    connected,
    messages,
    publishMessage,
  };
};
