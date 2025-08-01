/**
 * Payment Integration Types
 * Comprehensive type definitions for crypto and fiat payment processing
 */

export type PaymentProvider =
  | 'walletconnect'
  | 'hyperswitch'
  | 'oneinch'
  | 'symbiosis'
  | 'metamask'
  | 'coinbase';

export type PaymentMethod = 'crypto' | 'fiat' | 'nft' | 'swap' | 'bridge';

export type SupportedChain =
  | 'ethereum'
  | 'polygon'
  | 'bsc'
  | 'arbitrum'
  | 'optimism'
  | 'avalanche'
  | 'solana'
  | 'bitcoin'
  | 'cosmos';

export interface ChainConfig {
  chainId: number | string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet?: boolean;
}

export interface WalletInfo {
  address: string;
  chainId: number | string;
  provider: PaymentProvider;
  connected: boolean;
  balance?: string;
  ensName?: string;
}

export interface PaymentRequest {
  id: string;
  amount: string;
  currency: string;
  recipient: string;
  metadata?: Record<string, any>;
  chain?: SupportedChain;
  method: PaymentMethod;
  provider: PaymentProvider;
}

export interface PaymentResponse {
  success: boolean;
  txHash?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface SwapRequest {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
  chain: SupportedChain;
  recipient?: string;
}

export interface SwapResponse {
  success: boolean;
  txHash?: string;
  estimatedGas?: string;
  priceImpact?: string;
  route?: SwapRoute[];
  error?: string;
}

export interface SwapRoute {
  protocol: string;
  percentage: number;
  fromToken: string;
  toToken: string;
}

export interface BridgeRequest {
  fromChain: SupportedChain;
  toChain: SupportedChain;
  token: string;
  amount: string;
  recipient: string;
}

export interface BridgeResponse {
  success: boolean;
  txHash?: string;
  estimatedTime?: number;
  fee?: string;
  error?: string;
}

export interface NFTPaymentRequest {
  contractAddress: string;
  tokenId: string;
  price: string;
  currency: string;
  chain: SupportedChain;
  seller: string;
  buyer: string;
}

export interface PaymentConfig {
  walletConnect: {
    projectId: string;
    chains: ChainConfig[];
    metadata: {
      name: string;
      description: string;
      url: string;
      icons: string[];
    };
  };
  hyperswitch: {
    apiKey: string;
    publishableKey: string;
    environment: 'sandbox' | 'production';
    supportedMethods: string[];
  };
  oneInch: {
    apiKey: string;
    baseUrl: string;
    supportedChains: number[];
  };
  symbiosis: {
    apiUrl: string;
    supportedChains: string[];
  };
}

export interface PaymentState {
  wallet: WalletInfo | null;
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  supportedChains: ChainConfig[];
}

export interface Transaction {
  id: string;
  hash: string;
  type: PaymentMethod;
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  currency: string;
  timestamp: number;
  chain: SupportedChain;
  metadata?: Record<string, any>;
}

export interface PaymentHooks {
  onConnect?: (wallet: WalletInfo) => void;
  onDisconnect?: () => void;
  onPaymentStart?: (request: PaymentRequest) => void;
  onPaymentSuccess?: (response: PaymentResponse) => void;
  onPaymentError?: (error: string) => void;
  onChainChange?: (chainId: number | string) => void;
  onAccountChange?: (accounts: string[]) => void;
}

export interface PaymentProviderInterface {
  connect(): Promise<WalletInfo>;
  disconnect(): Promise<void>;
  pay(request: PaymentRequest): Promise<PaymentResponse>;
  getBalance(address: string, token?: string): Promise<string>;
  switchChain(chainId: number | string): Promise<void>;
  addToken(token: TokenInfo): Promise<boolean>;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

export interface SwapProviderInterface {
  getQuote(request: SwapRequest): Promise<SwapResponse>;
  executeSwap(request: SwapRequest): Promise<SwapResponse>;
  getSupportedTokens(chainId: number): Promise<TokenInfo[]>;
}

export interface BridgeProviderInterface {
  getBridgeQuote(request: BridgeRequest): Promise<BridgeResponse>;
  executeBridge(request: BridgeRequest): Promise<BridgeResponse>;
  getSupportedChains(): Promise<ChainConfig[]>;
}

export interface PaymentManagerOptions {
  config: PaymentConfig;
  hooks?: PaymentHooks;
  defaultChain?: SupportedChain;
  autoConnect?: boolean;
}
