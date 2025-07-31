/**
 * Payment Integration Module
 * Unified payment processing for crypto, fiat, NFTs, swaps, and bridges
 */

// Core exports
export { PaymentManager } from './manager.ts';

// Provider exports
export { WalletConnectProvider } from './providers/walletconnect.ts';
export { HyperswitchProvider } from './providers/hyperswitch.ts';
export { OneInchProvider } from './providers/oneinch.ts';
export { SymbiosisProvider } from './providers/symbiosis.ts';

// Hook exports
export {
  usePaymentManager,
  useWallet,
  usePayment,
  useSwap,
  useBridge,
  useTokens,
  useChains,
  useTransactions,
} from './hooks.ts';

// Utility exports
export {
  validatePaymentRequest,
  validateSwapRequest,
  validateBridgeRequest,
  isValidAddress,
  isValidChain,
  getChainConfig,
  formatAmount,
  parseAmount,
  formatCurrency,
  formatAddress,
  formatTransactionHash,
  formatTimeAgo,
  calculateGasCost,
  estimateGasLimit,
  calculatePriceImpact,
  findTokenByAddress,
  findTokenBySymbol,
  sortTokensByBalance,
  getExplorerUrl,
  getAddressExplorerUrl,
  getTransactionStatus,
  getReadableError,
  isRetryableError,
  createMockPaymentRequest,
  createMockSwapRequest,
  createMockBridgeRequest,
} from './utils.ts';

// Configuration exports
export {
  DEFAULT_PAYMENT_CONFIG,
  SUPPORTED_CHAINS,
  COMMON_TOKENS,
  API_ENDPOINTS,
  GAS_LIMITS,
  DEFAULT_SLIPPAGE,
  MAX_SLIPPAGE,
  DEFAULT_DEADLINE,
  PAYMENT_ERRORS,
} from './config.ts';

// Type exports
export type {
  PaymentProvider,
  PaymentMethod,
  SupportedChain,
  ChainConfig,
  WalletInfo,
  PaymentRequest,
  PaymentResponse,
  SwapRequest,
  SwapResponse,
  BridgeRequest,
  BridgeResponse,
  NFTPaymentRequest,
  PaymentConfig,
  PaymentState,
  Transaction,
  PaymentHooks,
  PaymentProviderInterface,
  SwapProviderInterface,
  BridgeProviderInterface,
  TokenInfo,
  PaymentManagerOptions,
  SwapRoute,
} from './types.ts';

// Default configuration helper
export function createPaymentConfig(overrides?: Partial<PaymentConfig>): PaymentConfig {
  return {
    ...DEFAULT_PAYMENT_CONFIG,
    ...overrides,
  };
}

// Quick setup helpers
export function createWalletConnectConfig(projectId: string) {
  return {
    ...DEFAULT_PAYMENT_CONFIG.walletConnect,
    projectId,
  };
}

export function createHyperswitchConfig(
  apiKey: string,
  environment: 'sandbox' | 'production' = 'sandbox'
) {
  return {
    ...DEFAULT_PAYMENT_CONFIG.hyperswitch,
    apiKey,
    environment,
  };
}

export function createOneInchConfig(apiKey: string) {
  return {
    ...DEFAULT_PAYMENT_CONFIG.oneInch,
    apiKey,
  };
}

export function createSymbiosisConfig(customApiUrl?: string) {
  return {
    ...DEFAULT_PAYMENT_CONFIG.symbiosis,
    ...(customApiUrl && { apiUrl: customApiUrl }),
  };
}

// Payment manager factory
export function createPaymentManager(
  config: Partial<PaymentConfig>,
  hooks?: PaymentHooks
): PaymentManager {
  return new PaymentManager({
    config: createPaymentConfig(config),
    hooks,
    autoConnect: false,
  });
}

// Quick start helper
export function quickStartPayments({
  walletConnectProjectId,
  hyperswitchApiKey,
  oneInchApiKey,
  environment = 'sandbox',
  hooks,
}: {
  walletConnectProjectId: string;
  hyperswitchApiKey?: string;
  oneInchApiKey?: string;
  environment?: 'sandbox' | 'production';
  hooks?: PaymentHooks;
}): PaymentManager {
  const config = createPaymentConfig({
    walletConnect: createWalletConnectConfig(walletConnectProjectId),
    ...(hyperswitchApiKey && {
      hyperswitch: createHyperswitchConfig(hyperswitchApiKey, environment),
    }),
    ...(oneInchApiKey && {
      oneInch: createOneInchConfig(oneInchApiKey),
    }),
    symbiosis: createSymbiosisConfig(),
  });

  return new PaymentManager({
    config,
    hooks,
    autoConnect: true,
  });
}

// Version info
export const KATALYST_PAYMENTS_VERSION = '1.0.0';

// Documentation links
export const DOCUMENTATION = {
  overview: 'https://docs.katalyst.dev/payments',
  walletConnect: 'https://docs.katalyst.dev/payments/walletconnect',
  hyperswitch: 'https://docs.katalyst.dev/payments/hyperswitch',
  oneInch: 'https://docs.katalyst.dev/payments/oneinch',
  symbiosis: 'https://docs.katalyst.dev/payments/symbiosis',
  examples: 'https://docs.katalyst.dev/payments/examples',
  troubleshooting: 'https://docs.katalyst.dev/payments/troubleshooting',
};

// Development helpers
export const DEV_TOOLS = {
  createMockPaymentRequest,
  createMockSwapRequest,
  createMockBridgeRequest,
  SUPPORTED_CHAINS,
  COMMON_TOKENS,
  PAYMENT_ERRORS,
};

export default PaymentManager;
